import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, fileName = "data.xlsx", headers = {}) => {
  // Map data sesuai header
  const mappedData = data.map((item) => {
    const newItem = {};
    for (const key in item) {
      const newKey = headers[key] || key;
      newItem[newKey] = item[key];
    }
    return newItem;
  });

  // Buat worksheet
  const worksheet = XLSX.utils.json_to_sheet(mappedData);

  // Hitung lebar kolom otomatis
  const cols = Object.keys(mappedData[0] || {}).map((key) => {
    const maxLength = Math.max(
      key.length, // panjang header
      ...mappedData.map((row) => (row[key] ? row[key].toString().length : 0))
    );
    return { wch: maxLength + 2 }; // tambahkan padding 2 karakter
  });
  worksheet["!cols"] = cols;

  // Buat workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate file Excel
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Simpan file di browser
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
