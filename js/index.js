document.addEventListener("DOMContentLoaded", function () {
    const listElement = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    let likedByList;
    const newUserId = 11;

    fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((book) => {
          const listItem = document.createElement("li");
          listItem.textContent = book.title;

          listItem.addEventListener("click", () => {
            showPanel.innerHTML = "";

            const thumbnailElement = document.createElement("img");
            thumbnailElement.src = book.img_url || "";

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = book.description || "";

            const likedByElement = document.createElement("ul");
            if (book.users && Array.isArray(book.likes)) {
              book.users.forEach((user) => {
                const userItem = document.createElement("li");
                userItem.textContent = user;
                likedByElement.appendChild(userItem);
              });
            } else {
              const noLikesItem = document.createElement("li");
              noLikesItem.textContent = "No Likes yet";
              likedByElement.appendChild(noLikesItem);
            }
            const likeButton = document.createElement("button");
            likeButton.textContent = "Like";

            likedByList = document.createElement("span");
            likedByList.textContent = `Liked by: ${book.users.map(user => user.username).join(", ")}`;

            likeButton.addEventListener("click", () => {
                const hasLiked = book.users.some(user => user.id === newUserId)
             fetch(`http://localhost:3000/books/${book.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    users: hasLiked
                    ? book.users.filter(user => user.id !== newUserId )
                    : [...book.users, {id: newUserId, username: "New User"}],
                  }),
                })
                .then(() => {
                    if(hasLiked){
                    book.users.push({id: newUserId, username: "New User"});
                    } else {
                        book.users.push({id: newUserId, username: "New User"});
                    }
                     likedByList.textContent = `Liked by: ${book.users.map(user => user.username).join(", ")}`;
                    
                })
                  .catch((error) => console.error("Error liking book:", error));
                });
                
                showPanel.appendChild(thumbnailElement);
                showPanel.appendChild(descriptionElement);
                showPanel.appendChild(likedByElement);
                showPanel.appendChild(likeButton);
                showPanel.appendChild(likedByList);
            })

             listElement.appendChild(listItem);
          });
        
        
      })
      .catch((error) => console.error("Error fetching books:", error));
    }); 


