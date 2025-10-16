import axiosInstance from "../axios";

export async function getDriver() {
  const res = await axiosInstance.get("/drivers");
  return res.data;
}

export async function createDriver(formData) {
  const res = await axiosInstance.post("/drivers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateDriver(id, formData) {
  const res = await axiosInstance.put(`/drivers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteDriver(ids) {
  const res = await axiosInstance.delete("/drivers", {
    data: ids,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}