// write your code here

document.addEventListener('DOMContentLoaded', (e)=>{
    e.preventDefault()
    let ramenMenu = document.querySelector('#ramen-menu')
    let ramenDetail = document.querySelector('#ramen-detail')
    let form = document.querySelector('#new-ramen')
    let editForm = document.querySelector('#edit-ramen')


//Display Ramen images in div#ramen-menu
    function getRamen(){
        return fetch('http://localhost:3000/ramens').then(res=> res.json())        
    }
    
    getRamen()
    .then(data => {
        data.forEach(ramenObj =>{
            ramenMenu.innerHTML += `<img id="${ramenObj.id}" src="${ramenObj.image}" alt="">`
        })
    })

//click on images and have details displayed on #ramen-detail
ramenMenu.addEventListener('click', (e)=>{
    getRamen()
    .then(data => {
        data.forEach(ramen =>{
            if(ramen.id === parseInt(e.target.id)){
               ramenDetail.innerHTML = ` <img class="detail-image" id="${ramen.id}"src="${ramen.image}" alt="Insert Name Here" />
               <h2 class="name">${ramen.name}</h2>
               <h3 class="restaurant">${ramen.restaurant}</h3>`

               document.querySelector('#rating-display').innerHTML = `<span id='rating-display'>${ramen.rating}</span>`
               document.querySelector('#comment-display').innerHTML = `<p id='comment-display'>${ramen.comment}</p>`
            }
        })
    })
})
//Create a new Ramen after submitting the new-ramen form - have image of new ramen auto add into ramenMenu
    form.addEventListener('submit', (e)=>{
        e.preventDefault()
        let nameInput = form.querySelector('#new-name')
        let restaurantInput = form.querySelector('#new-restaurant')
        let imageInput = form.querySelector('#new-image')
        let ratingInput = form.querySelector('#new-rating')
        let commentInput = form.querySelector('#new-comment')
        
        fetch('http://localhost:3000/ramens', {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                "name": nameInput.value,
                "restaurant": restaurantInput.value,
                "image": imageInput.value,
                "rating": ratingInput.value,
                "comment": commentInput.value
            })
        })
        .then(res => res.json())
        .then(data =>{
            ramenMenu.innerHTML += `<img id="${data.id}" src="${data.image}" alt="">`
        })
        form.reset()
        
    })

//Advanced Deliverables
    //See the details for the first ramen as soon as the page loads (without clicking on an image)

  fetch(`http://localhost:3000/ramens/1`)
  .then(res=>res.json())
  .then(data => {
        ramenDetail.innerHTML = ` <img class="detail-image" id="${data.id}" src="${data.image}" alt="Insert Name Here" />
        <h2 class="name">${data.name}</h2>
        <h3 class="restaurant">${data.restaurant}</h3>`

        document.querySelector('#rating-display').innerHTML = `<span id='rating-display'>${data.rating}</span>`
        document.querySelector('#comment-display').innerHTML = `<p id='comment-display'>${data.comment}</p>`

  })

  //Update the rating and comment for a ramen by submitting a form.
  
  let editBtn = document.querySelector('#edit')

  function handleEditClick(){
    editForm.style.display = "block"
    form.style.display = "none"
    let comment = document.querySelector('#comment-display').textContent
    document.querySelector('textarea').value = comment
    let rating = document.querySelector('#rating-display').innerText
    document.querySelector('#new-rating').value = rating
    console.log(rating)
  }

  editBtn.addEventListener('click', handleEditClick)

  function handleEditSubmit(e){
    e.preventDefault()
    let ramenId = ramenDetail.querySelector('img').id
    let updatedRating = parseInt(document.querySelector('#new-rating').value)    
    let updatedComment = document.querySelector('#new-comment').value

    fetch(`http://localhost:3000/ramens/${ramenId}`,{
        method: 'PATCH',
        headers:{
            "Content-type": "Application/json",
            Accept: "Application/json"
        },
        body: JSON.stringify({
            "rating": updatedRating,
            "comment": updatedComment
        })
    })
    .then(res => res.json())
    .then(data => {
        document.querySelector('#rating-display').textContent = data.rating
        document.querySelector('#comment-display').textContent = data.comment
    })
    editForm.reset()
    editForm.style.display = "none"
    form.style.display = "block"
    
  }
  editForm.addEventListener('submit', handleEditSubmit)

  //Add delete button - have it delete from Ramen Menu and DB
  function handleDeleteClick(){
    let ramens = ramenMenu.querySelectorAll('img')
    let currentRamen = ramenDetail.querySelector('img')
    for(let ramen of ramens){
        if(ramen.id === currentRamen.id){
            ramen.remove()
            fetch(`http://localhost:3000/ramens/${ramen.id}`,{
                method:'DELETE'
            })
        }
        ramenDetail.innerHTML = '<img class="detail-image" src="./assets/image-placeholder.jpg" alt="Insert Name Here" /><h2 class="name">Insert Name Here</h2><h3 class="restaurant">Insert Restaurant Here</h3>'
        document.querySelector('#rating-display').innerHTML = `<span id='rating-display'>Insert rating here</span>`
        document.querySelector('#comment-display').innerHTML = `<p id='comment-display'>Insert restaurant here</p>`
    }
    
  }
  document.querySelector('#delete').addEventListener('click', handleDeleteClick)

})