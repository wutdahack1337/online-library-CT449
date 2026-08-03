<script setup>
import { ref } from 'vue'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import vueLogo from '../assets/vue.svg'

const count = ref(0)
</script>

<template>
  <section class="center">
    <div class="hero">
      <img :src="heroImg" class="base" width="170" height="179" alt="" />
      <img :src="vueLogo" class="framework" alt="Vue logo" />
      <img :src="viteLogo" class="vite" alt="Vite logo" />
    </div>
    <div>
      <h1>Get started</h1>
      <p>Edit <code>src/App.vue</code> and save to test <code>HMR</code></p>
    </div>
    <button type="button" class="counter" @click="count++">
      Count is {{ count }}
    </button>
  </section>

  <div class="ticks"></div>

  <section class="next-steps">
    <div class="docs">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#documentation-icon"></use>
      </svg>
      <h2>Documentation</h2>
      <p>Your questions, answered</p>
      <ul>
        <li>
          <a href="https://vite.dev/" target="_blank">
            <img class="logo" :src="viteLogo" alt="" />
            Explore Vite
          </a>
        </li>
        <li>
          <a href="https://vuejs.org/" target="_blank">
            <img class="button-icon" :src="vueLogo" alt="" />
            Learn more
          </a>
        </li>
      </ul>
    </div>
    <div class="social">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#social-icon"></use>
      </svg>
      <h2>Connect with us</h2>
      <p>Join the Vite community</p>
      <ul>
        <li>
          <a href="https://github.com/vitejs/vite" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#github-icon"></use>
            </svg>
            GitHub
          </a>
        </li>
        <li>
          <a href="https://chat.vite.dev/" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#discord-icon"></use>
            </svg>
            Discord
          </a>
        </li>
        <li>
          <a href="https://x.com/vite_js" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#x-icon"></use>
            </svg>
            X.com
          </a>
        </li>
        <li>
          <a href="https://bsky.app/profile/vite.dev" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#bluesky-icon"></use>
            </svg>
            Bluesky
          </a>
        </li>
      </ul>
    </div>
  </section>

  <div class="ticks"></div>
  <section class="spacer"></section>
</template>

<style scoped>
.center {
  text-align: center;
  padding: 2rem 0;
}

.hero {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.hero img {
  display: block;
  margin: 0 auto;
}

.hero .framework,
.hero .vite {
  position: absolute;
  bottom: 0;
  width: 60px;
  height: 60px;
  animation: float 2s ease-in-out infinite;
}

.hero .vite {
  right: -10px;
  animation-delay: 0.2s;
}

.hero .framework {
  left: -10px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem 0;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
}

p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0.5rem 0;
}

code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
}

.counter {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.2s;
}

.counter:hover {
  background-color: #2563eb;
}

.counter:active {
  background-color: #1d4ed8;
}

.ticks {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 2rem 0;
}

.next-steps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 3rem auto 0;
  max-width: 800px;
  text-align: left;
}

.docs,
.social {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.docs ul,
.social ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.docs li,
.social li {
  margin-bottom: 0.75rem;
}

a {
  color: #3b82f6;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

a:hover {
  color: #2563eb;
}

.logo,
.button-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.spacer {
  height: 2rem;
}

@media (max-width: 768px) {
  .next-steps {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
