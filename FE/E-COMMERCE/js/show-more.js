function navigateToFeedbackPage() {
    window.location.href = "Feedback.html";
}
let menuicn = document.querySelector(".menuicn"); 
let nav = document.querySelector(".navcontainer"); 

menuicn.addEventListener("click", () => { 
	nav.classList.toggle("navclose"); 
})
function navigateToAdminPage() {
    window.location.href = "Finder.html";
}