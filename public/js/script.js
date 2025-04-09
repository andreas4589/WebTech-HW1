document.addEventListener("DOMContentLoaded", () => {
    const course = document.querySelector("[data-course]").dataset.course;
    const fetchUrl = `/users/api/classmates/${encodeURIComponent(course)}`;

  
    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error("Server returned " + res.status);
        return res.json();
      })
      .then(students => {
        const list = document.getElementById("classmate-list");
        list.innerHTML = "";
  
        if (!students.length) {
          list.innerHTML = "<li>No other students enrolled in this course.</li>";
          return;
        }
  
        students.forEach(student => {
            const li = document.createElement("li");
            li.className = "classmate-card";
            
            li.innerHTML = `
              <strong>${student.firstName} ${student.lastName}</strong>
              ${student.photo ? `<img src="${student.photo}" alt="photo" />` : "<div style='height:150px; background:#eee; border-radius:6px;'>No photo</div>"}
              <form method="POST" action="/users/send-friend-request">
                <input type="hidden" name="recipient" value="${student.email}" />
                <button type="submit" class="button-style">Send Friend Request</button>
              </form>
            `;
          list.appendChild(li);
        });
      })
      .catch(err => {
        console.error("Fetch error:", err);
        document.getElementById("classmate-list").innerHTML =
          "<li>Error loading classmates.</li>";
      });
  });
  