let globalUsers = [];
let globalFilteredUsers = [];

const loader = document.querySelector('#preloader');

let btnClear = document.querySelector('#btn-clear');
let inputSearch = document.querySelector('#search-people');
let divHTML = document.querySelector('#users-list');
let usersFound = document.querySelector('#users-found');
let usersHTML = '';
let divStatistics = '';

async function start() {
  await fetchUser();
  inputClear();
  renderUser();
  renderStatistics();
  filterUsers();
  preloader();
}

async function fetchUser() {
  const response = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await response.json();
  globalUsers = json.results
    .map((user) => {
      const { name, dob, gender, picture } = user;

      return {
        fullName: `${name.first} ${name.last}`,
        age: dob.age,
        gender: gender,
        image: picture.large,
      };
    })
    .sort((a, b) => {
      return a.fullName.localeCompare(b.fullName);
    });

  globalFilteredUsers = [...globalUsers];
}

function renderUser() {
  let userIncrement = 0;
  usersHTML = '';
  divHTML.innerHTML = '';
  globalFilteredUsers.forEach((user) => {
    userIncrement++;

    const { fullName, age, image } = user;

    const userHTML = `
        <div class="col s6 m4 l4">
          <div class="card small center">
            <div class="image-user ">
              <img class="img-user" src="${image}" alt="Foto do ${fullName}">
            </div>
            <div class="name-user">
              <span> ${fullName} </span>
            </div>
            <div class="age-user">
              <span> ${age} anos </span>
            </div>
          </div>
        </div>
  `;
    usersHTML += userHTML;
  });
  divHTML.innerHTML = usersHTML;

  if (globalFilteredUsers.length === 0) {
    usersFound.innerHTML = `
    <h1 class="text-found"> Nenhum usuário encontrado :( </h1>
  `;
  }
  if (globalFilteredUsers.length === 1) {
    usersFound.innerHTML = `
    <h1 class="text-found"> ${userIncrement} usuário encontrado </h1>
  `;
  }
  if (globalFilteredUsers.length > 1) {
    usersFound.innerHTML = `
    <h1 class="text-found"> ${userIncrement} usuários encontrados </h1>
  `;
  }
}

function filterUsers() {
  inputSearch.addEventListener('keyup', (event) => {
    btnClear.classList.remove('disabled');
    if (inputSearch.value <= 0) {
      btnClear.classList.add('disabled');
    }
    if (event.key) {
      let filterValue = inputSearch.value.toLowerCase().trim();
      globalFilteredUsers = globalUsers.filter((user) => {
        return user.fullName.toLowerCase().includes(filterValue);
      });

      renderUser();
      renderStatistics();
    }
  });
}

function renderStatistics() {
  let maleIncrement = 0;
  let femaleIncrement = 0;
  let ageSum = 0;
  let ageIncrement = 0;
  let ageAverage = 0;

  for (user in globalFilteredUsers) {
    const { age, gender } = globalFilteredUsers[user];

    if (gender === 'male') {
      maleIncrement++;
    }
    if (gender === 'female') {
      femaleIncrement++;
    }

    ageSum += age;
    ageIncrement++;
    ageAverage = (ageSum / ageIncrement).toFixed(2);
  }

  divStatistics = document.querySelector('#statistics');

  let titleStatistics = document.querySelector('#title-statistics');
  titleStatistics.innerHTML = `
    <h1 class="center title">Estatísticas</h1>
  `;

  divStatistics.innerHTML = `
    <div>
      <span> Sexo Masculino: ${maleIncrement} </span>
    </div>
    <div>
      <span> Sexo Feminino: ${femaleIncrement} </span>
    </div>
    <div>
      <span> Soma das idades: ${ageSum} </span>
    </div>
    <div>
      <span> Média das idades: ${ageAverage} </span>
    </div>
  `;
}

function inputClear() {
  btnClear.addEventListener('click', () => {
    inputSearch.value = '';
    inputSearch.focus();
    btnClear.classList.add('disabled');

    usersHTML = '';
    divHTML.innerHTML = '';

    usersFound.innerHTML = `
      <h1 class="text-found"> Nenhum usuário encontrado :( </h1>
    `;

    divStatistics.innerHTML = `
    <div>
      <span> Sexo Masculino: 0 </span>
    </div>
    <div>
      <span> Sexo Feminino: 0 </span>
    </div>
    <div>
      <span> Soma das idades: 0 </span>
    </div>
    <div>
      <span> Média das idades: 0 </span>
    </div>
  `;
  });
}

function preloader() {
  loader.classList.add('hide');
}

start();
