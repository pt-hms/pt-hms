import axiosInstance from "../axios";

export async function uploadRitase(ss_order) {
  const res = await axiosInstance.post("/ritase-upload", ss_order, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getAllRitase() {
  const res = await axiosInstance.get("/ritase");
  return res.data
}

export async function getMyRitase() {
  const res = await axiosInstance.get(`/ritase-saya`);
  return res.data;
}

export async function createRitase(formData) {
  const res = await axiosInstance.post("/ritase", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateRitase(id, formData) {
  const res = await axiosInstance.put(`/ritase/${id}`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function deleteRitase(ids) {
  const res = await axiosInstance.post("/ritase/delete", {
    data: { "id": ids },
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}