# spms-reporting-automation
Google Apps Script automation for synchronizing UWP work assignments to employee IPCR spreadsheets.

## Overview

This project automates the synchronization of employee work assignments from the Office Performance Commitment and Review (OPCR) to individual Individual Performance Commitment and Review (IPCR) spreadsheets using Google Apps Script.

The solution allows one administrator to update all employee IPCR files from a single script, eliminating the need for employees to manually compare and update their assignments.

---

## Problem

Previously:

- Around 40 employees manually checked the OPCR every six months.
- Employees compared their assigned work one by one.
- Work assignments had to be copied manually into each IPCR.
- The process took several weeks across the office.

---

## Solution

The automation:

- Reads the master OPCR spreadsheet.
- Finds each employee's assigned work.
- Opens each employee's IPCR spreadsheet.
- Clears outdated assignments.
- Updates work assignments automatically.
- Repeats the process for every employee.

---

## Technologies

- Google Apps Script
- JavaScript
- Google Sheets

---

## Features

- Bulk updating of employee IPCR spreadsheets
- Dynamic header detection
- Spreadsheet ID mapping
- Automatic filtering of assigned tasks
- Logging for missing employees or configuration errors

---

## Impact

- Automated updates for approximately 40 employee IPCR spreadsheets.
- Reduced a process requiring weeks of manual work to less than one day.
- Improved consistency and reduced manual errors.

---

## Future Improvements

- Add email notifications
- Generate update summary reports
- Create a custom menu in Google Sheets
- Store employee information in a configuration sheet
