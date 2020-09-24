var btnViewDetails = document.querySelectorAll(".btn-view-detail");

btnViewDetails.forEach((item) => {
   item.addEventListener("click", (e) => {
       document.querySelector(".popup-detail-order").classList.remove("d-none");
   });
});

document.querySelector(".btn-discard-close").addEventListener("click", (e) => {
   document.querySelector(".popup-detail-order").classList.add("d-none");
});