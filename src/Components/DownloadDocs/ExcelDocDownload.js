import * as  XLSX from 'xlsx';

const ExcelDocDownload = (data, fileName) => {
    // Create a new workbook and a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file and download it
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default ExcelDocDownload;