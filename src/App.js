import React, { Component, Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";

let data = [
  {
    category: "music",
    types: [
      {
        category: "classic",
        types: [{ category: "local" }, { category: "international" }]
      },
      {
        category: "pop",
        types: [{ category: "local" }, { category: "international" }]
      }
    ]
  },
  {
    category: "movie",
    types: [
      {
        category: "action",
        types: [{ category: "local" }, { category: "international" }]
      },
      {
        category: "classcic",
        types: [
          {
            category: "Europe",
            types: [
              {
                category: "Finnish",
                types: [{ category: "Sami" }]
              },
              { category: "Non-Finnish" }
            ]
          },
          { category: "international" }
        ]
      }
    ]
  }
];

function renderSubItem(
  items,
  onCheck,
  isParentChecked = false,
  treeIndex,
  setQuery
) {
  return items.map(item => {
    let index = treeIndex ? `${treeIndex}-${item.category}` : item.category;
    return (
      <ul key={index}>
        <Checkboxs
          items={item}
          isParentChecked={isParentChecked}
          onCheckParent={onCheck}
          preIndex={treeIndex}
          setQuery={setQuery}
        />
      </ul>
    );
  });
}
class Checkboxs extends React.PureComponent {
  constructor() {
    super();
    this.state = { checked: false};
  }
  onCheckParent() {
    this.setState({ checked: true});
  }
  onCheck() {
    const { items, preIndex } = this.props;
    let treeIndex = preIndex ? `${preIndex}-${items.category}` : items.category;
    if (typeof this.props.onCheckParent === "function") {
      this.props.onCheckParent(this.state.checked ? true : false);
    }
    this.props.setQuery(treeIndex, this.state.checked ? true : false);
    this.setState({ checked: !this.state.checked });
  }
  componentWillReceiveProps({ isParentChecked }) {
    if (this.props.isParentChecked && !isParentChecked) {
      this.setState({ checked: false });
    }
  }
  componentDidUpdate({ checked }) {
    if (!checked && this.state.checked) {
      if (typeof this.props.onCheckParent === "function") {
        this.props.onCheckParent();
      }
    }
  }
  render() {
    const { items, preIndex, setQuery } = this.props;
    let treeIndex = preIndex ? `${preIndex}-${items.category}` : items.category;
    return (
      <li>
        <input
          type="checkbox"
          checked={this.state.checked}
          onChange={() => this.onCheck()}
        />
        <label>{items.category}</label>
        {items.types
          ? renderSubItem(
              items.types,
              () => this.onCheckParent(),
              this.state.checked,
              treeIndex,
              setQuery
            )
          : null}
      </li>
    );
  }
}
const Container = ({ children, setQuery }) =>
  React.Children.toArray(children).map(child =>
    React.cloneElement(child, {
      setQuery: (q, remove) => setQuery(q, remove)
    })
  );
class App extends Component {
  constructor() {
    super();
    this.state = {
      queryStr: []
    };
  }
  setQuery(query, remove = false) {
    let alreadyExists = this.state.queryStr.find(str => str === query);
    if (alreadyExists || remove) {
      this.removeQuery(query, true);
    } else
      this.setState({
        queryStr: [
          ...this.state.queryStr.filter(str => !query.includes(str)),
          query
        ]
      });
  }
  removeQuery(query, removeChildrenQuery = false) {
    if (removeChildrenQuery) {
      this.setState({
        queryStr: this.state.queryStr.filter(
          str => str !== query && !str.includes(query)
        )
      });
    } else {
      this.setState({
        queryStr: this.state.queryStr.filter(str => str !== query)
      });
    }
  }
  render() {
    return (
      <div className="App">
        <div>
          <ul>
            <Container
              setQuery={(query, remove) => this.setQuery(query, remove)}
            >
              {data.map((item, index) => {
                return <Checkboxs key={index} items={item} />;
              })}
            </Container>
          </ul>
        </div>
        Your selected checkboxes are:
          {this.state.queryStr.map(str => (
            <div key={str}>{str}</div>
          ))}
      </div>
    );
  }
}

export default App;
