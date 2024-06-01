import "./styles.css";

console.clear();

const root = document.getElementById("app");

/*
  * можно выбрать один вариант(radio buttons) или несколько (checkbox)(r)
  * может быть два состояния: когда еще не проголосовал, и когда уже проголосовал
  * PollWidget ложим в форму
  * используем тег label для отображения пункта

*/

class PollWidget {
  constructor(root, { multi, optionsList, name, onVote }) {
    this.multi = multi;
    this.optionsList = optionsList;
    this.name = name;
    this.onVote = onVote;
    this.root = root;
    this.init(root);
  }

  init(root) {
    this.container = document.createElement("form");
    this.container.classList.add("poll-widget");

    const ulElem = document.createElement("ul");
    for (let option of this.optionsList) {
      const liElem = document.createElement("li");
      const labelElem = document.createElement("label");
      // labelElem.setAttribute("for", this.name);
      const optionElem = document.createElement("input");
      optionElem.setAttribute("type", this.multi ? "checkbox" : "radio");
      optionElem.setAttribute("name", this.name);
      optionElem.setAttribute("value", option.value);
      labelElem.append(optionElem);
      labelElem.append(document.createTextNode(option.title));

      liElem.append(labelElem);
      ulElem.append(liElem);
    }

    this.voteButton = document.createElement("button");
    this.voteButton.textContent = "Vote";
    this.voteButton.setAttribute("type", "submit");

    this.container.append(ulElem);
    this.container.append(this.voteButton);
    root.append(this.container);
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.container.addEventListener("submit", this.voteHandler.bind(this));
  }
  voteHandler(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const values = [...form.values()];
    this.onVote(values).then((res) => {
      this.showResults(res);
    });
  }
  showResults(res) {
    this.root.removeChild(this.container);
    this.container = document.createElement("div");
    const ul = document.createElement("ul");
    const sum = res.reduce((a, b) => a + b.count, 0);

    for (let option of res) {
      const optElem = document.createElement("li");
      optElem.classList.add("result");
      optElem.textContent = `${option.title}: ${option.count}`;

      const progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");
      optElem.append(progressBar);
      ul.append(optElem);

      setTimeout(() => {
        progressBar.style.width = (option.count * 100 / sum) + '%';
      }, 0);
    }

    this.container.append(ul);
    this.root.append(this.container);
  }

  destroy() {}
}

const list = [
  {
    id: 0,
    title: "Facebook",
    value: "facebook"
  },
  {
    id: 1,
    title: "Span",
    value: "spanchat"
  },
  {
    id: 2,
    title: "Google",
    value: "alphabet"
  },
  {
    id: 3,
    title: "Microsoft",
    value: "microsoft"
  }
];

const pollWidget = new PollWidget(root, {
  multi: true,
  optionsList: list,
  name: "company",
  onVote: (companies) => {
    return sendResult(companies).then(() => [
      {
        value: "facebook",
        title: "Facebook",
        count: 425
      },
      {
        value: "spanchat",
        title: "Span",
        count: 79
      },
      {
        value: "alphabet",
        title: "Google",
        count: 234
      },
      {
        value: "microsoft",
        title: "Microsoft",
        count: 373
      }
    ]);
  }
});

function sendResult() {
  return Promise.resolve();
}

// poolWidget.getResults(); //
