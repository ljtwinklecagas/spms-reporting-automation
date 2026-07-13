function updateAllIPCRs() {
  // CONFIGURATION
  const uwpSpreadsheetId = 'YOUR_UWP_SPREADSHEET_ID_HERE'; // The shared UWP spreadsheet ID
  const uwpSheetName = 'UWP Commitment Jul-Dec 2025';
  const headersToFind = [
    'MFOs',
    'Success Indicators',
    '5',
    '4',
    '3',
    '2',
    '1'
  ];

  // --- List of every employee, with the ID of THEIR IPCR spreadsheet ---
  const employees = [
    { name: 'Employee1', ipcrSpreadsheetId: 'UWP_SPREADSHEET_ID_HERE' },
    { name: 'Employee2', ipcrSpreadsheetId: 'UWP_SPREADSHEET_ID_HERE' },
    // one line per employee...
  ];

  // --- Open UWP sheet once and reuse for everyone ---
  const uwpSheet = SpreadsheetApp.openById(uwpSpreadsheetId).getSheetByName(uwpSheetName);
  const uwpData = uwpSheet.getDataRange().getValues();

  employees.forEach(emp => {
    updateEmployeeIPCR(emp.name, emp.ipcrSpreadsheetId, uwpData, headersToFind);
  });
}

function updateEmployeeIPCR(employeeName, ipcrSpreadsheetId, uwpData, headersToFind) {
  // --- This will find the  header row and column for this employee ---
  let headerRowIndex = -1;
  let employeeColIndex = -1;
  for (let r = 0; r < uwpData.length; r++) {
    const row = uwpData[r];
    const cIndex = row.findIndex(cell => cell === employeeName);
    if (cIndex !== -1) {
      headerRowIndex = r;
      employeeColIndex = cIndex;
      break;
    }
  }

  if (headerRowIndex === -1 || employeeColIndex === -1) {
    Logger.log(`Could not find '${employeeName}' in the UWP sheet.`);
    return;
  }

  // --- This will find the columns to copy based on headersToFind ---
  const headerRow = uwpData[headerRowIndex];
  const columnsToCopy = [];
  headersToFind.forEach(headerName => {
    const index = headerRow.findIndex(cell => {
      if (!cell) return false;
      return cell.toString().trim().toLowerCase() === headerName.toLowerCase();
    });
    if (index !== -1) {
      columnsToCopy.push(index);
    } else {
      Logger.log(`Header '${headerName}' not found in row ${headerRowIndex + 1} (employee: ${employeeName})`);
    }
  });

  if (columnsToCopy.length === 0) {
    Logger.log(`No matching headers found for '${employeeName}'. Nothing to copy.`);
    return;
  }

  // --- Data starts after the header row ---
  const dataStartRow = headerRowIndex + 1;

  // --- Open this employee's IPCR sheet by ID ---
  const ipcrFile = SpreadsheetApp.openById(ipcrSpreadsheetId);
  const sheet = ipcrFile.getSheetByName(employeeName);
  if (!sheet) {
    Logger.log(`Sheet '${employeeName}' not found in the IPCR spreadsheet.`);
    return;
  }

  // --- Clear previous content from row 2 downwards ---
  const startRow = 2;
  const startCol = 2;
  const clearRows = sheet.getMaxRows() - startRow + 1;
  sheet.getRange(startRow, startCol, clearRows, columnsToCopy.length).clearContent();

  // --- Collect rows where this employee is marked TRUE ---
  let rowsForEmployee = [];
  for (let r = dataStartRow; r < uwpData.length; r++) {
    const isAssigned = uwpData[r][employeeColIndex];
    if (isAssigned === true || isAssigned === 'TRUE') {
      const rowData = columnsToCopy.map(i => uwpData[r][i]);
      rowsForEmployee.push(rowData);
    }
  }

  // --- Paste into employee's sheet starting from B2 ---
  if (rowsForEmployee.length > 0) {
    sheet.getRange(startRow, startCol, rowsForEmployee.length, columnsToCopy.length).setValues(rowsForEmployee);
    Logger.log(`Updated '${employeeName}' sheet with ${rowsForEmployee.length} row(s).`);
  } else {
    Logger.log(`No rows found for '${employeeName}'.`);
  }
}
