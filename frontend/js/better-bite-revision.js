/* Better Bite revision. CONFIGURATION: set window.BETTER_BITE_API before this script
   with { meals: '/api/meals', groceries:'/api/groceries' } using confirmed endpoints.
   The adapter supports {data:[...]}, {results:[...]}, {meals:[...]}, {stores:[...]}, or arrays.
   No unverified API endpoint or API key is embedded here. */
(() => {
  'use strict';
 const config = window.BETTER_BITE_API || {
  groceries: "http://127.0.0.1:3001/places/groceries",
  meals: "http://127.0.0.1:3001/recipes"
};
  const $=(s)=>document.querySelector(s);
  const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=(n)=>Number.isFinite(Number(n))?`$${Number(n).toFixed(2)}`:'Price unavailable';
  const demoMeals=[
    {id:'chicken',name:'Grilled Rosemary Chicken Bowl',restaurant:'Fresh Kitchen',price:14.05,calories:520,protein:52,carbs:46,fat:18,rating:4.6,type:'Lunch',tags:['High Protein','Healthy'],emoji:'🍗',prep:15,cook:20,servings:2,description:'Rosemary chicken with vegetables and a satisfying grain bowl.',ingredients:['2 chicken breasts','1 cup cooked rice','1 cup mixed vegetables','1 tsp rosemary','1 tbsp olive oil'],steps:['Season chicken with rosemary and a little oil.','Cook chicken fully to 165°F (74°C).','Prepare rice and vegetables.','Combine and serve.'],tips:['Add extra vegetables for more fiber.']},
    {id:'tofu',name:'Miso Glazed Tofu Bowl',restaurant:'Bolay',price:11.95,calories:420,protein:22,carbs:62,fat:12,rating:4.7,type:'Dinner',tags:['Vegan','High Protein'],emoji:'🥗',prep:15,cook:20,servings:2,description:'Crispy tofu with a savory miso glaze, rice, and vegetables.',ingredients:['14 oz firm tofu','2 tbsp cornstarch','1 tbsp miso','1 tbsp soy sauce','1 cup rice','2 cups mixed vegetables'],steps:['Press tofu and cut into cubes.','Coat lightly in cornstarch and cook until golden.','Mix miso and soy sauce with a little water.','Prepare rice and vegetables.','Toss tofu in sauce and assemble the bowl.'],tips:['Use reduced-sodium soy sauce if preferred.']},
    {id:'salad',name:'Greek Salad Bowl',restaurant:'CAVA',price:13.45,calories:350,protein:15,carbs:20,fat:24,rating:4.4,type:'Lunch',tags:['Vegetarian','Mediterranean'],emoji:'🥙',prep:15,cook:0,servings:2,description:'A crisp salad with greens, cucumbers, tomatoes, olives, and feta.',ingredients:['4 cups mixed greens','1 cucumber','1 cup cherry tomatoes','1/2 cup feta','1/4 cup olives','1 tbsp olive oil','1 tbsp lemon juice'],steps:['Wash and cut the vegetables.','Whisk together olive oil and lemon juice.','Combine vegetables, feta and olives.','Toss with dressing and serve.'],tips:['Add chickpeas for extra protein.']}
  ];
  const demoStores=[
    {id:'publix',name:'Publix',type:'grocery',description:'Supermarket with produce, meat, dairy and everyday groceries.',emoji:'🛒'},
    {id:'aldi',name:'ALDI',type:'grocery',description:'Discount grocery store with fresh produce and pantry essentials.',emoji:'🥦'},
    {id:'wholefoods',name:'Whole Foods Market',type:'grocery',description:'Natural and organic grocery store with fresh produce.',emoji:'🥑'}
  ];
  async function load(url,parameter){
    if(!url)return null;
    const target=new URL(url,window.location.href);
    for(const [k,v] of Object.entries(parameter||{})){if(v)target.searchParams.set(k,v)}
    const res=await fetch(target.toString(),{headers:{Accept:'application/json'}});
    if(!res.ok)throw new Error(`Server returned ${res.status}`);
    const payload=await res.json();
    const list=Array.isArray(payload)?payload:(payload.results||payload.data||payload.meals||payload.stores||payload.items);
    if(!Array.isArray(list))throw new Error('Expected an array of items in API response');
    return list;
  }
  
function mealNormalize(a, i) {
  return {
    id: String(a.id ?? a.meal_id ?? `api-${i}`),
    name: a.name ?? a.title ?? "Unnamed meal",
    restaurant: a.restaurant ?? a.restaurant_name ?? "Recipe",
    price: a.price ?? a.cost ?? null,
    calories: a.calories ?? a.nutrition?.calories ?? null,
    protein: a.protein ?? a.nutrition?.protein ?? null,
    carbs: a.carbs ?? a.nutrition?.carbs ?? null,
    fat: a.fat ?? a.nutrition?.fat ?? null,
    rating: a.rating ?? null,
    type: a.type ?? a.meal_type ?? "",
    tags: Array.isArray(a.tags) ? a.tags :
      (Array.isArray(a.dietary) ? a.dietary : []),
    distance: a.distance ?? a.distance_miles ?? null,
    image: a.image ?? a.image_url ?? "",
    emoji: "🍽️",
    prep: a.prep ?? a.prep_time ?? null,
    cook: a.cook ?? a.cook_time ?? null,
    servings: a.servings ?? null,
    description: a.description ?? "",
    ingredients: Array.isArray(a.ingredients)
      ? a.ingredients.map(item =>
          typeof item === "string"
            ? item
            : item.original ?? item.name ?? ""
        )
      : [],
    steps: (Array.isArray(a.steps) ? a.steps :
      (Array.isArray(a.instructions) ? a.instructions : [])
    ).map(item =>
      typeof item === "string" ? item : item.step ?? ""
    ),
    tips: Array.isArray(a.tips) ? a.tips : []
  };
}

  function storeNormalize(a,i){return {id:String(a.id??a.place_id??`api-${i}`),name:a.name??'Unnamed store',type:String(a.type??a.category??'grocery').toLowerCase(),description:a.description??a.address??'',address:a.address??'',distance:a.distance??a.distance_miles??null,phone:a.phone??'',website:a.website??'',emoji:'🛒'}}
  function numberText(n,suffix=''){return n==null||n===''?'—':`${safe(n)}${suffix}`}
  function photo(m){return m.image?`<div class="food-image"><img loading="lazy" src="${safe(m.image)}" alt="${safe(m.name)}" onerror="this.remove();this.parentElement.textContent='🍽️'"></div>`:`<div class="food-image" role="img" aria-label="${safe(m.name)}">${safe(m.emoji||'🍽️')}</div>`}
  function status(msg){const el=$('#sourceMessage');if(el)el.textContent=msg}
  function renderMeals(){
    const form=$('#filters'),q=$('#mealQuery').value.trim().toLowerCase(),type=$('#mealType').value.toLowerCase(),budget=Number(form.querySelector('[name="budget"]:checked')?.value||0),dist=Number(form.querySelector('[name="distance"]:checked')?.value||0),diets=[...form.querySelectorAll('[name="diet"]:checked')].map(x=>x.value),maxcal=Number(form.elements.calories.value||0),minprotein=Number(form.elements.protein.value||0);
    const matches=meals.filter(m=>{
      const text=`${m.name} ${m.restaurant} ${(m.tags||[]).join(' ')}`.toLowerCase();const tags=(m.tags||[]).map(t=>String(t).toLowerCase());
      return (!q||text.includes(q))&&(!type||String(m.type).toLowerCase()===type)&&(!budget||(m.price!=null&&Number(m.price)<=budget))&&(!dist||(m.distance!=null&&Number(m.distance)<=dist))&&diets.every(d=>tags.includes(d))&&(!maxcal||(m.calories!=null&&Number(m.calories)<=maxcal))&&(!minprotein||(m.protein!=null&&Number(m.protein)>=minprotein));
    });
    $('#count').textContent=`${matches.length} result${matches.length===1?'':'s'} · ${isDemo?'sample data':'API data'}`;
    $('#mealResults').innerHTML=matches.length?matches.map(m=>`<article class="result-item">${photo(m)}<div><h3>${safe(m.name)}</h3><div class="muted">${safe(m.restaurant)}</div><div class="meta">${money(m.price)} · ${numberText(m.calories,' cal')} · ${numberText(m.protein,'g protein')}</div><div class="rating">${m.rating==null?'Rating unavailable':'★ '+safe(m.rating)}</div><div class="recommend">Why we recommend: ${safe((m.tags||[]).join(' · ')||'Explore nutritional details')}</div></div><div class="actions"><button class="btn btn-primary" data-detail="${safe(m.id)}">View Details</button><button class="btn btn-outline" data-compare="${safe(m.id)}">Compare</button></div></article>`).join(''):'<div class="empty">No meals match these filters. Try resetting or changing the search.</div>';
    document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>showDetail(b.dataset.detail)));
    document.querySelectorAll('[data-compare]').forEach(b=>b.addEventListener('click',()=>compareMeal(b.dataset.compare)));
  }
  function compareMeal(id){const m=meals.find(x=>x.id===id);if(!m)return;const el=$('#compare');compared=compared.filter(x=>x.id!==id);if(compared.length>=2)compared.shift();compared.push(m);el.hidden=false;el.textContent=`Compare selected: ${compared.map(x=>`${x.name} (${numberText(x.calories)} cal; ${numberText(x.protein)}g protein)`).join(' vs ')}. Select another meal to compare.`;el.scrollIntoView({behavior:'smooth',block:'nearest'})}
  
async function showDetail(id) {
  let m = meals.find(x => x.id === id);
  if (!m) return;

  if (!isDemo && config.meals) {
    try {
      const response = await fetch(
        `${config.meals.replace(/\/$/, "")}/user/${encodeURIComponent(id)}`
      );

      if (!response.ok) throw new Error("Recipe details unavailable");

      const fullRecipe = await response.json();
      m = mealNormalize(fullRecipe, 0);
    } catch (error) {
      console.warn("Using available recipe information:", error.message);
    }
  }

    $('#listing').classList.add('hidden');$('#detail').classList.add('active');
    const steps=(m.steps||[]).map(x=>`<li>${safe(typeof x==='object'?(x.text??x.description??''):x)}</li>`).join('');
    $('#detailContent').innerHTML=`<div class="detail-hero">${photo(m)}<div class="detail-intro"><h1>${safe(m.name)}</h1><p>${safe(m.description||'Recipe details supplied by the data provider.')}</p><div class="stats"><span>Prep: ${numberText(m.prep,' min')}</span><span>Cook: ${numberText(m.cook,' min')}</span><span>Servings: ${numberText(m.servings)}</span></div>${(m.tags||[]).map(t=>`<span class="tag">${safe(t)}</span>`).join('')}</div></div><div class="detail-grid"><section><h2>Ingredients</h2>${m.ingredients.length?`<ul>${m.ingredients.map(x=>`<li>${safe(typeof x==='object'?(x.name??x.text??''):x)}</li>`).join('')}</ul>`:'<p>Ingredients not provided by the API.</p>'}<div class="tipbox"><strong>Why it’s a Better Bite</strong><p>${safe((m.tags||[]).join(' · ')||'See nutritional information.')}</p></div></section><section><h2>Instructions</h2>${steps?`<ol>${steps}</ol>`:'<p>Instructions not provided by the API.</p>'}<div class="tipbox"><strong>Quick Tip</strong><p>${safe(m.tips[0]||'Review ingredient labels and portion sizes.')}</p></div></section><aside><h2>Nutrition Facts</h2><div class="nutrition"><span>${numberText(m.calories)}<small>Calories</small></span><span>${numberText(m.protein,'g')}<small>Protein</small></span><span>${numberText(m.carbs,'g')}<small>Carbs</small></span><span>${numberText(m.fat,'g')}<small>Fat</small></span></div><div class="tipbox"><strong>Better Bite Tips</strong><p>Nutrition varies with ingredients and serving size.</p></div><h2>Related Recipes</h2>${meals.filter(x=>x.id!==m.id).slice(0,2).map(x=>`<p><button class="btn btn-outline" data-related="${safe(x.id)}">${safe(x.name)}</button></p>`).join('')}</aside></div>`;
    document.querySelectorAll('[data-related]').forEach(b=>b.addEventListener('click',()=>showDetail(b.dataset.related)));
    window.scrollTo(0,0);
  }
  function back(){ $('#detail').classList.remove('active');$('#listing').classList.remove('hidden');window.scrollTo(0,0) }
  function renderStores(){const q=$('#storeQuery').value.trim().toLowerCase(),type=$('#storeFilters').querySelector('[name="type"]:checked')?.value||'',dist=Number($('#storeFilters').querySelector('[name="distance"]:checked')?.value||0);
    const matches=stores.filter(s=>(!q||`${s.name} ${s.description} ${s.type}`.toLowerCase().includes(q))&&(!type||s.type.includes(type))&&(!dist||(s.distance!=null&&Number(s.distance)<=dist)));
    $('#count').textContent=`${matches.length} result${matches.length===1?'':'s'} · ${isDemo?'sample listings, not ZIP-verified':'API results'}`;
    $('#storeResults').innerHTML=matches.length?matches.map(s=>`<article class="result-item store-item"><div class="store-icon">${safe(s.emoji)}</div><div><h3>${safe(s.name)}</h3><div class="muted">${safe(s.type)}${s.distance==null?'':` · ${safe(s.distance)} miles`}</div><p class="meta">${safe(s.description)}</p>${s.address?`<p class="muted">${safe(s.address)}</p>`:''}</div><div class="actions"><button class="btn btn-primary" data-store="${safe(s.id)}">View Details</button></div></article>`).join(''):'<div class="empty">No grocery results match your search. Try another query or reset the filters.</div>';
    document.querySelectorAll('[data-store]').forEach(b=>b.addEventListener('click',()=>{const s=stores.find(x=>x.id===b.dataset.store);if(!s)return;const msg=[s.name,s.description,s.address,s.phone,s.website].filter(Boolean).join('\n');window.alert(msg+'\n\n'+(isDemo?'Sample listing; not verified for the entered ZIP code.':'Check provider data for accuracy.'))}));
  }
  let meals=[],stores=[],isDemo=true,compared=[];
  async function initMeals(){meals=demoMeals.map(x=>({...x}));const url=config.meals;if(url){try{meals=(await load(url)).map(mealNormalize);isDemo=false;status('Showing meals from the configured team API.');}catch(e){isDemo=true;status(`API unavailable (${e.message}). Showing SAMPLE meals only; live integration is not verified.`)}}else status('Sample meal data — API endpoint not configured. Search and filters work on these examples only.');
    $('#mealSearch').addEventListener('submit',e=>{e.preventDefault();renderMeals()});$('#mealType').addEventListener('change',renderMeals);$('#mealQuery').addEventListener('input',renderMeals);
    $('#filters').addEventListener('submit',e=>{e.preventDefault();renderMeals()});$('#filters').addEventListener('reset',()=>setTimeout(renderMeals,0));$('#backBtn').addEventListener('click',back);renderMeals();
  }
  async function getStores(){const zip=$('#zip').value.trim();if(!/^[0-9]{5}$/.test(zip)){status('Enter a valid five-digit ZIP code.');return}const url=config.groceries;if(url){status('Searching the configured grocery API…');try{stores=(await load(url,{zip,search:$('#storeQuery').value.trim()})).map(storeNormalize);isDemo=false;status(`Results provided by configured API for ZIP ${zip}.`)}catch(e){stores=demoStores.map(x=>({...x}));isDemo=true;status(`API unavailable (${e.message}). Showing SAMPLE stores; not locations near ${zip}.`)}}else{stores=demoStores.map(x=>({...x}));isDemo=true;status(`Sample listings only — no grocery API is configured. These stores have NOT been verified for ZIP ${zip}.`)}renderStores()}
  function initStores(){stores=demoStores.map(x=>({...x}));status('Sample listings only — enter a ZIP code and search. API and live map not configured.');$('#storeSearch').addEventListener('submit',e=>{e.preventDefault();getStores()});$('#storeFilters').addEventListener('submit',e=>{e.preventDefault();renderStores()});$('#storeFilters').addEventListener('reset',()=>setTimeout(renderStores,0));$('#storeQuery').addEventListener('input',renderStores);renderStores()}
  if($('#mealResults'))initMeals();if($('#storeResults'))initStores();
})();
