import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,


} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
let allData = [];

const tbody = document.getElementById("list");

onSnapshot(collection(db, "violations"), (snapshot) => {
  allData = [];

  if (snapshot.empty) {
    renderTable([]);
    return;
  }

  snapshot.forEach(d => {
    allData.push({
      id: d.id,
      ...d.data()
    });
  });

  renderTable(allData);
});


function attachDeleteEvents() {
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      if (!confirm("Bạn có chắc muốn xóa vi phạm này?")) return;

      await deleteDoc(doc(db, "violations", id));
    };
  });
}
function renderTable(data) {
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" class="empty">
          Không có vi phạm trong ngày này
        </td>
      </tr>
    `;
    return;
  }

  data.forEach(v => {
    let time = "—";
    if (v.createdAt) {
      time = v.createdAt.toDate().toLocaleString("vi-VN");
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.maSV}</td>
      <td>${v.hoTen}</td>
      <td>${v.lop}</td>
      <td>${v.khoaHoc}</td>
      <td>${v.khoa}</td>
      <td>${v.ngay}</td>
      <td>${v.buoi}</td>
      <td>${v.vipham}</td>
      <td>${time}</td>
      <td>${v.nguoiNhap || "—"}</td>
      <td>
        <button class="btn-delete" data-id="${v.id}">X</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  attachDeleteEvents();
}
document.getElementById("btnFilter").onclick = () => {
  const date = document.getElementById("filterDate").value;
  if (!date) return;

  const filtered = allData.filter(v => v.ngay === date);
  renderTable(filtered);
};

document.getElementById("btnClear").onclick = () => {
  renderTable(allData);
};