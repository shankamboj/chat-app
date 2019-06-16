const socket = io()

//Elements

const $messageForm = document.querySelector('#message-form')
const $messageForminput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector("#send-location")
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate =document.querySelector('#message-template').innerHTML   
const  locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
console.log("sidebar Template is"+ sidebarTemplate)

// Options
const { username , room } =Qs.parse(location.search , {ignoreQueryPrefix: true})


const autoscroll= () => {
    //New message element
    const $newMessage = $messages.lastElementChild
    //Height  of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    //console.log(newMessageStyles)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight+16
    //visible height
    const visibleHeight= $messages.offsetHeight
    //Height of messages container
    const containerHeight= $messages.scrollHeight

    //How far have i scrolled?
    const scrollOffset = $messages.scrollTop+visibleHeight 
    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }



}

socket.on('countUpdated', (count)=> {
    console.log('The count has been updated'+count)
})


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm  A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm  A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

$messageForm.addEventListener('submit', (e) =>  {

    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')//disable button//first argument is attribute name
    const message = e.target.elements.message.value

    socket.emit('sendMessage',message,(error)=>{
       
        $messageFormButton.removeAttribute('disabled') ///removing attribute by its name
        $messageForminput.value=''
        $messageForminput.focus()
        if(error){
            console.log(error)
        }
        else{
            console.log("message emitted succesfully")
        }
    })
})

    $locationButton.addEventListener('click',()=>{

    $locationButton.setAttribute('disabled','disabled')//disabled button
    if(!navigator.geolocation){
        return alert("Geolocatonn is not supported by the browser")
    }
    $locationButton.removeAttribute('disabled')

   navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position)

    socket.emit("sendLocation",{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude

    },()=>{
        console.log("Locagion shared!")
    })
    })
    
})

socket.on('roomData',({roo , users})=>{
    const html =  Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})
socket.emit('join',{username , room}, (error)=>{
    if(error){
        alert(error) 
        location.href='/'
    }
})