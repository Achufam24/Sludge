<template>
     <div class="view login" v-if="state.username === '' || state.username === null">
		 <transition name="des" appear>
        <div style="position:absolute; top:10px; color:#fff;">
			 <h1 style="text-align:center;">Sludge</h1>
			 <p id="head-text">Chat Publicly & Anonymously!</p>
		 </div>
		 </transition>
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
		  <transition name="fade" appear>
             <h1>Login to Sludge </h1>
		  </transition>
        <label for="username">Username</label>
        <input 
          type="text" 
          v-model="inputUsername" 
          placeholder="Please enter your username..." />
        <input 
          type="submit" 
          value="Login" />
      </div>
    </form>
  </div>
  
  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="Logout" >Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>
    
    <section class="chat-box">
      <div 
        v-for="message in state.messages" 
        :key="message.key" 
        :class="(message.username == state.username ? 'message current-user' : 'message')">
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input 
          type="text" 
          v-model="inputMessage" 
          placeholder="Write a message..." />
		  <transition name="fade" appear>
               <input 
          type="submit" 
          value="Send" />
		  </transition>
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import db from './db';

export default {
  setup () {
    const inputUsername = ref("");
    const inputMessage = ref("");
    const state = reactive({
      username: "",
      messages: []
    });
    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    }
    const Logout = () => {
      state.username = "";
    }
    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");
      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }
      const message = {
        username: state.username,
        content: inputMessage.value
      }
      messagesRef.push(message);
      inputMessage.value = "";
    }
    onMounted(() => {
      const messagesRef = db.database().ref("messages");
      messagesRef.on('value', snapshot => {
        const data = snapshot.val();
        let messages = [];
        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          });
        });
        state.messages = messages;
      });
    });
    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout
    }
  }
}
</script>


<style lang="scss">
* {
	font-family: 'Poppins', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.view {
	display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #df7116;
	
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 50%;
			padding: 15px;
			
			
			.form-inner {
				display: block;
				background-color: #FFF;
				padding: 50px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
				h1 {
					color: #AAA;
					font-size: 28px;
					margin-bottom: 30px;
					font-family: 'Rubik Bubbles', cursive;
				}
				label {
					display: block;
					margin-bottom: 5px;
					color: #AAA;
					font-size: 16px;
					transition: 0.4s;
				}
				input[type="text"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px;
					margin-bottom: 15px;
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					background-color: #df7116;
					border-radius: 8px;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
				&:focus-within {
					label {
						color: df7116;
					}
					input[type="text"] {
						background-color: #FFF;
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
						&::placeholder {
							color: #666;
						}
					}
				}
			}
		}
	}
	&.chat {
		flex-direction: column;
		header {
			position: relative;
			display: block;
			width: 100%;
			padding: 50px 30px 10px;
			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: none;
				
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
			}
			h1 {
				color: #FFF;
			}
		}
		.chat-box {
			/*border-radius: 24px 24px 0px 0px;*/
			background-color: #FFF;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;
			.message {
				display: flex;
				margin-bottom: 15px;
				
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						padding-left: 15px;
						padding-right: 15px;
					}
					.content {
						display: inline-block;
						padding: 10px 20px;
						background-color: rgb(216, 212, 212);
						border-radius: 999px; 
						color: #333;
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}
				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;
					.message-inner {
						max-width: 75%;
						.content {
							color: #FFF;
							font-weight: 600;
							background-color: rgb(178, 83, 32);
						}
					}
				}
			}
		}
		footer {
			position: sticky;
			bottom: 0px;
			background-color: #FFF;
			padding: 30px;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			form {
				display: flex;
				input[type="text"] {
					flex: 1 1 100%;
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
				 	border-radius: 8px 0px 0px 8px; 
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
					
					input[type="submit"] {
						appearance: none;
						border: none;
						outline: none;
						background: none;
						display: block;
						padding: 10px 15px;
						border-radius: 0px 8px 8px 0px;
						background-color: rgb(178, 83, 32);
						color: #FFF;
						font-size: 18px;
						font-weight: 700;
					}
				}
			}
		}
	}
	.logout{
			background-color: #fff !important;
			color: #df7116 !important;
			border-radius: 99px !important;
			padding: 5px !important;
	}
		.logout:hover{
			background: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%) !important;
			color: #F3F3F3 !important;
		}
			.des-enter-from{
					opacity: 0;
					transform: translateY(-50px)
			}
			.des-enter-to{
					opacity: 1;
					transform: translateY(0px)
			}
			.des-enter-active{
			transition: all 4s ease;
			}
			.des-leave-from{
			opacity: 1;
			transform: translateY(0)
			}
			.des-leave-to{
			opacity: 0;
			transform: translateY(50px)
			}
			.des-leave-active{
			transition: all 6s ease;
			}
			.fade-enter-from{
			opacity: 0;
			transform: translateY(-20px)
			}
			.fade-enter-to{
			opacity: 1;
			transform: translateY(-0px)
			}
			.fade-enter-active{
			transition: all 9s ease;
			}
		@keyframes wobble {
		0% {transform: translateY(-100px); opacity: 0}
		50% {transform: translateY(0px); opacity: 1;}
		}
		@media only screen and (max-width: 600px) {
			.login, .login-form{
			width: 100% !important;
		}
			}
			@media only screen and (max-width: 320px) {
			#head-text{
				font-size: 15px
				}
			h1{
				font-size: 20px
			}
		}
	


</style>
