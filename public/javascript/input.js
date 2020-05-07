const inputForm = document.getElementById('submitArticle');
inputForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    let httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "/api/articles/", true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            console.log(httpRequest.responseText);
            window.location.href = "/index.html";
        }
    }
    httpRequest.send("title=" + title + "&body=" + body);
});