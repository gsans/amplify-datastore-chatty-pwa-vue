<template>
  <div id="app">
    <div class="app-header">
      <div class="app-logo">
        <img
          src="https://aws-amplify.github.io/images/Logos/Amplify-Logo-White.svg"
          alt="AWS Amplify"
        />
      </div>
      <h1>Welcome to the Amplify Framework</h1>
    </div>
    <div class="app-body">
      <amplify-authenticator>
        <div class="welcome">
          <h1>Hey, {{user.username}}!</h1>
          <amplify-sign-out></amplify-sign-out>
        </div>
      </amplify-authenticator>
      <div v-if="user">
        <div class="form-body" v-if="user.username">
          <form v-on:submit.prevent autocomplete="off">
            <div class="input" v-bind:class="{ offline: offline }">
              <input class="message-input" v-model="form.message" autocomplete="off" placeholder="Enter your message..." />
            </div>
            <button @click="sendMessage">Send</button>
            <button @click="deleteAll">Delete All</button>
          </form>
        </div>
        <div v-if="user.username">
          <div v-if="loading" class="loading">Loading...</div>
          <div class="chatty-container" v-if="!loading" v-bind:class="{ offline: offline }">
            <div class="offline-msg" v-if="offline">You are offline. Your messages will be shared once you are connected.</div>
            <div class="chatty">
              <div v-for="message of sorted" :key="message.id">
                <div v-bind:class="[(user.username === message.user) ?'me' : 'others']">
                  <div class="message-container">
                    <div class="message-user">
                      {{ message.user }}
                      <span
                        class="message-time"
                        :title="moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')"
                      >{{ moment(message.createdAt).format('HH:mm:ss')}}</span>
                    </div>
                    <div class="message-text">{{ message.message }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Chatty } from "./models";
import moment from "moment";
import { Hub } from 'aws-amplify';

export default {
  name: "app",
  data() {
    return {
      user: {},
      messages: [],
      form: {},
      loading: true,
      subscription: undefined,
      listener: undefined,
      offline: undefined
    };
  },
  computed: {
    sorted() {
      let messages = [...this.messages];
      return messages.sort((a, b) => -a.createdAt.localeCompare(b.createdAt));
    }
  },
  created() {
    //listen to datastore
    console.log('Registering datastore hub');
    this.listener = Hub.listen('datastore', message => {
      const { event, data } = message.payload;
      console.log("DataStore event", event, data);
      if (event === 'networkStatus') {
        this.offline = !data.active;
      }
    })

    //Subscribe to changes
    this.subscription = DataStore.observe(Chatty).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
      this.loadMessages();
    });

      // authentication state managament
    onAuthUIStateChange((state, user) => {
      switch (state) {
        case AuthState.SignedIn: {
          //console.log("User signed in");
          this.user = user;
          this.loadMessages();
          return;
        }
        case AuthState.SignedOut: {
          //console.log("User signed out");
          this.user = {};
          return;
        }
        default: {
          //console.log(`Event: ${event}`);
        }
      }
    });
  },
  destroyed() {
    if (!this.subscription) return;
    this.subscription.unsubscribe();
    this.listener();
  },
  methods: {
    moment: () => moment(),
    loadMessages() {
      try {
        this.loading = true;
        DataStore.query(Chatty, Predicates.ALL).then(messages => {
          this.loading = false;
          this.messages = messages;
        });
      } catch (error) {
        console.log("Error loading messages...", error);
      } finally {
        this.loading = false;
      }
    },
    sendMessage() {
      const { message } = this.form
      if (!message) return;
      DataStore.save(
        new Chatty({
          user: this.user.username,
          message: message,
          createdAt: new Date().toISOString()
        })
      ).then(() => {
        console.log('message created!');
        this.form = { message: '' };
        this.loadMessages();
      })
      .catch(e => {
        console.log('error creating message...', e);
      });
    },
    async deleteAll() {
      await DataStore.delete(Chatty, Predicates.ALL)
      .then(() => this.loadMessages())
      .catch(e => {
        console.log('error deleting all messages...', e);
      });
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
:root {
  --amazonOrange: #ff9900;
  --lightAmazonOrange: #ffac31;
  --darkAmazonOrange: #e88b01;
  --squidInk: #232f3e;
  --lightSquidInk: #31465f;
  --deepSquidInk: #152939;
  --grey: #828282;
  --lightGrey: #c4c4c4;
  --silver: #e1e4ea;
  --darkBlue: #31465f;
  --red: #dd3f5b;
  --white: #ffffff;
  --light-blue: #00a1c9;
  --button-color: var(--white);
  --button-background-color: var(--amazonOrange);
  --button-click: var(--darkAmazonOrange);
  --link-color: var(--amazonOrange);
  --form-color: var(--white);
  --input-color: var(--deepSquidInk);
  --input-background-color: var(--white);
  --font-family: "Amazon Ember", "Helvetica Neue Light", "Helvetica Neue",
    "Helvetica", "Arial", "sans-serif";
  --body-background: #f8f4f4;
  --component-width-desktop: 460px;
  --component-width-mobile: 100%;
  --color-primary: #ff9900;
  --color-primary-accent: #232f3e;
  --color-primary-highlight: #ffc46d;
  --color-background: #232f3e;
  --color-secondary: #152939;
  --color-secondary-accent: #31465f;
  --color-danger: #dd3f5b;
  --color-error: #d0021b;
  --color-accent-brown: #828282;
  --color-accent-blue: #e1e4ea;
  --gradient-blaze: linear-gradient(270deg, #ffc300 0%, #ff9000 100%);
  --color-blue: #007eb9;
  --color-purple: #527fff;
  --color-gray: #828282;
  --color-white: #ffffff;
  --input-border: 1px solid #c4c4c4;
  --input-padding: 0.5em 0.5em 0.3em 1em;
  --box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.15);
  --button-height: 42px;
  --interactions-conversation-height: 250px;
  --ion-color-primary: #ff9900;
  --ion-color-primary-rgb: 255, 153, 0;
  --ion-color-primary-contrast: #fff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #232f3e;
  --ion-color-primary-tint: #ffc46d;
}
html,
body {
  font-family: "Amazon Ember", "Helvetica", "sans-serif";
  margin: 0;
}
a {
  color: #ff9900;
}
h1 {
  font-weight: 300;
}
.app {
  width: 100%;
}
.app-header {
  color: white;
  text-align: center;
  background: linear-gradient(30deg, #f90 55%, #ffc300);
  width: 100%;
  margin: 0 0 1em 0;
  padding: 3em 0 3em 0;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.3);
}
.app-logo {
  width: 126px;
  margin: 0 auto;
}
.app-body {
  width: 60%;
  margin: 0 auto;
  text-align: center;
  min-height: 500px;
}
.form-body {
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
  -webkit-justify-content: center;
  -webkit-align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.form-body button {
  background-color: #ff9900;
  font-size: 14px;
  color: white;
  text-transform: uppercase;
  padding: 1em;
  border: none;
  cursor: pointer;
  margin: 10px;
}
button:hover {
  opacity: 0.8;
}
input {
  width: 100px;
  padding: 6px;
  font-size: 14px;
  color: var(--input-color);
  background-color: var(--input-background-color);
  background-image: none;
  border: 1px solid var(--lightGrey);
  border-radius: 3px;
  box-sizing: border-box;
  margin: 10px;
}
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
  -webkit-justify-content: center;
  -webkit-align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.card {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.25);
  min-width: 180px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  /* height: 100%; */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  backface-visibility: hidden;
  margin: 25px;
}
.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);
}
.name {
  font-style: italic;
}
.symbol {
  color: #999;
}
.price,
.loading {
  font-weight: bold;
  font-size: 2em;
  line-height: 0.9;
  margin: 10px;
}
.loading {
  margin-top: 35px;
}
/* remove blue highlight */
textarea:hover,
input:hover:not([type="checkbox"]),
textarea:active,
input:active:not([type="checkbox"]),
textarea:focus,
input:focus:not([type="checkbox"]),
button:focus,
button:active,
button:hover,
label:focus,
.btn:active,
.btn.active,
select {
  outline: 0px !important;
  -webkit-appearance: none;
  box-shadow: none !important;
}
textarea {
  background-color: #eee;
  border-radius: 0 4px 4px 0;
}
textarea {
  border-radius: 4px 0 0 4px;
  border-right: 10px solid #dbdbdb;
}
.remove {
  top: -15px;
  position: relative;
  align-self: flex-end;
}
.remove button {
  background-color: #dd3f5b;
  color: white;
  border-radius: 31px;
  border: 0px;
}
.SelectInput__selectInput___1I_W8 > select {
  margin-top: 10px;
  margin-right: -10px;
  padding: 16px 20px 16px 16px;
  background-position: calc(100% - 10px) calc(1em + 8px),
    calc(100% - 4px) calc(1em + 8px), calc(100% - 2.5em) 0.5em !important;
}

.chatty-container,
.input {
  display: grid;
  grid-column-start: 2;
  grid-column-end: 9;
  grid-row-start: 1;
  grid-row-end: 190;
  background: rgb(233, 229, 229);
  border-radius: 5px;
}
.chatty {
  background: none;
  margin: 0;
  xpadding: 0 0 50px 0;
  max-height: 200px;
  min-height: 200px;
  overflow: scroll;
  scroll-behavior: smooth;
}
.me {
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  display: flex;
}
.message-container {
  min-width: fit-content;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.07);
  margin: 10px 15px 2px 15px;
}
.me .message-container {
  border-bottom-left-radius: 0px;
  background-color: white;
}
.others .message-container {
  border-bottom-right-radius: 0px;
  background-color: #dcf8c6;
}

.message-time {
  font-size: 0.8rem;
  margin: 0 0 0.2rem 0;
  color: #e91e63;
  text-align: left;
}
.message-user {
  font-size: 0.8rem;
  margin: 0 0 0.2rem 0;
  color: #e91e63;
  text-align: left;
}
.others {
  justify-content: flex-end;
  align-items: flex-end;
  overflow: hidden;
  display: flex;
}
.message-text {
  text-align: left;
}
.message-time {
  font-size: 0.6rem;
  color: gray;
  margin-left: 15px;
}
.message-input {
  height: 50px;
  margin: 5px;
  width: inherit;
  padding-left: 15px;
  display: block;
}

.form-body form {
  width: 100%;
}

::-webkit-scrollbar {
  min-width: 12px;
  width: 12px;
  max-width: 12px;
  min-height: 12px;
  height: 12px;
  max-height: 12px;
}
::-webkit-scrollbar-thumb {
  background: #9e9e9e;
  border: none;
  border-radius: 100px;
  border: solid 3px #e5e5e5;
  box-shadow: inset 0px 0px 3px #999;
}
::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
  box-shadow: inset 0px 0px 3px #888;
}
::-webkit-scrollbar-thumb:active {
  background: #aaa;
  box-shadow: inset 0px 0px 3px #7f7f7f;
}
::-webkit-scrollbar-button {
  display: block;
  height: 26px;
}
::-webkit-scrollbar-corner {
  background-color: #eae5e5;
}

.app-body button {
  min-width: 153px;
}

.app-body {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}

.form-body {
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
  -webkit-justify-content: center;
  -webkit-align-items: center;
  flex-direction: row;
  flex-wrap: wrap; 
}
.form-body button {
  background-color: #ff9900;
  font-size: 14px;
  color: white;
  text-transform: uppercase;
  padding: 1em;
  border: none;
  cursor: pointer;
  margin: 10px;
}
.app-body button:hover {
  opacity: 0.8;
}

input {
  padding: 6px;
  font-size: 14px;
  color: var(--input-color);
  background-color: var(--input-background-color);
  background-image: none;
  border: 1px solid var(--lightGrey);
  border-radius: 3px;
  box-sizing: border-box;
  margin: 10px;
}

.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.welcome h1 {
  margin-right: 40px;
}
.offline, .input.offline {
  background: #F06292;
}
.offline-msg {
  position: relative;
  height: 60px;
  padding-top: 10px;
  font-weight: 600;
  font-size: 1em;
  font-style: italic;
}

@media screen and (max-width: 640px) {
  .app-body {
    width: 95%;
  }
  .welcome {
    flex-direction: column;
    margin-bottom: 20px;
  }
  .app-body button {
    min-width: unset;
  }
  .app-header h1 {
    display: none;
  }
  .app-header {
    margin: unset;
    padding: 20px 0px 20px 0px;
  }
  .app-header img {
    width: 100px;
  }
}
</style>
