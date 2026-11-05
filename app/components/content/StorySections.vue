<template>
  <div class="story-sections">
    <div><slot /></div>
    <aside class="review-checklist"><slot name="checklist" /></aside>
  </div>
</template>
<style>
.review-checklist {
  border: 1px solid var(--color-rule);
  border-radius: 12px;
  background: var(--color-surface);
  padding: 1.5rem;
  margin-top: 2rem;
}
.review-checklist h2 {
  margin-top: 0;
}
</style>
