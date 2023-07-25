import { collection, addDoc , getDocs , deleteDoc , doc, updateDoc,serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { db } from "./firbase.mjs";
const querySnapshot = await getDocs(collection(db, "posts"));
var posts = document.getElementById('posts');
document.getElementById('btn').addEventListener('click', async () => {

    let postContent=document.getElementById('inputTextarea').value
console.log('HI');
    try {
        const docRef = await addDoc(collection(db, "Posts"), {
            postContent:postContent,
            timestamp: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
        window.location.reload
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
  
  const postDelete = async(id) => {
    
    console.log(id);
    
    await deleteDoc(doc(db, "Posts", id));
    window.location.reload

}
const postUpdate =async(id)=>{

    const ref=doc(db, "Posts",id);
    // Set the "capital" field of the city 'DC'
    const updateText=prompt("enter");
    try{

        await updateDoc(ref, {
            postContent: updateText
        });
        alert("Data updated!");
        window.location.reload
      }
      catch(e){
        console.error("ERROR:" ,e);
      }
    } 
    function toggleDropdown(postId) {
      const dropdown = document.getElementById(`dropdownMenu-${postId}`);
    dropdown.classList.toggle("show");
  }
  
  window.onclick = function (event) {
    if (!event.target.matches('.dots-btn')) {
      const dropdowns = document.getElementsByClassName('dropdown-content');
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  };
  function copyPostContent(content) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
  
    // Append the textarea to the DOM
    document.body.appendChild(textarea);
  
    // Select the content of the textarea
    textarea.select();
  
    try {
      // Copy the selected content to the clipboard
      const successful = document.execCommand('copy');
      if (successful) {
        console.log("Content copied to clipboard: ", content);
        alert("Post content copied to clipboard!");
      } else {
        console.error("Failed to copy content to clipboard.");
        alert("Failed to copy post content to clipboard.");
      }
    } catch (error) {
      console.error("Error copying content to clipboard: ", error);
      alert("Failed to copy post content to clipboard.");
    }
  
    // Remove the textarea from the DOM
    document.body.removeChild(textarea);
  }
  
  
  async function updateTimestampField() {
      const postsRef = collection(db, "Posts");
      const querySnapshot = await getDocs(postsRef);

  querySnapshot.forEach(async (doc) => {
    if (!doc.data().timestamp) {
      try {
        const postRef = doc.ref;
        await updateDoc(postRef, {
          timestamp: serverTimestamp()
        });
        console.log(`Document ${doc.id} updated with timestamp.`);
      } catch (e) {
        console.error(`Error updating document ${doc.id}: `, e);
      }
    }
  });
}
updateTimestampField()


posts.innerHTML = '';

// Sorting the querySnapshot.docs based on the timestamp in descending order
const sortedDocs = querySnapshot.docs.sort((a, b) => {
    const timestampA = a.data().timestamp?.toDate();
    const timestampB = b.data().timestamp?.toDate();
  return timestampB - timestampA;
});

// Looping through the sortedDocs to display new to old
sortedDocs.forEach((doc) => {
    const timestamp = doc.data().timestamp;
    const jsDate = timestamp?.toDate();
    const dateString = jsDate ? jsDate.toLocaleDateString() : "Unknown Date";
  const timeString = jsDate ? jsDate.toLocaleTimeString() : "Unknown Time";
  
  const postCards= `
  <div class="card">
  <div class="card-content">
  <p>${doc.data().postContent}</p>
  <div class="dropdown">
  <h6><i>Posted on  </i>${dateString} at ${timeString}</h6>
  <button class="dots-btn" onclick="toggleDropdown('${doc.id}')">...</button>
          <div class="dropdown-content" id="dropdownMenu-${doc.id}">
          <a onclick='postUpdate("${doc.id}")'>Edit</a>
          <a onclick='postDelete("${doc.id}")'>Delete</a>
          <a class="copy-btn" onclick="copyPostContent('${doc.data().postContent}')">Copy</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert each new post at the end of the 'posts' element
  posts.insertAdjacentHTML('beforeend', postCards);
});



window.copyPostContent=copyPostContent  
window.toggleDropdown=toggleDropdown  
window.postUpdate = postUpdate;
window.postDelete = postDelete;
window.autoExpand=autoExpand;


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! EMOJI SELECTOR !!!!!!!!!!!!!!!!!!!!!
const emojiSelectorIcon=document.getElementById('emojiSelectorIcon');
const emojiSelector=document.getElementById('emojiSelector');
const emojiList=document.getElementById('emojiList');
const emojiSearch=document.getElementById('emojiSearch')
emojiSelectorIcon.addEventListener('click', ()=>{
    emojiSelector.classList.toggle('active');
    
})
fetch('https://emoji-api.com/emojis?access_key=a10b7a7176db70a7bbdbe5d32a31745b7608f530')
.then(res=>res.json())
.then(data=>loadEmoji(data))
function loadEmoji(data){
    data.forEach(emoji => {
        let li=document.createElement('li');
        li.setAttribute('emoji-name',emoji.slug)
        li.textContent=emoji.character;
         li.addEventListener('click', () => {
        const inputField = document.querySelector('#inputTextarea');
        inputField.value += emoji.character;
    });
        emojiList.appendChild(li);
    });
}
emojiSearch.addEventListener('keyup', e =>{
let value=e.target.value;
let emojis=document.querySelectorAll('#emojiList li');
emojis.forEach(emoji => {
    if(emoji.getAttribute('emoji-name').toLowerCase().includes(value)){
        emoji.style.display='flex';
    }
    else{
    emoji.style.display='none'
    }
})
})