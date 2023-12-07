import React, { Component, useState } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import { getTotalPhotos, getTotalTopics, getUserWithLeastUploads, getUserWithMostUploads } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];

// function Dashboard(props) {
//   const [state, setState] = useState({ focused: null });
//   const dashboardClasses = classnames("dashboard", {
//     "dashboard--focused": state.focused
//   });

//   function selectPanel(id) {
//     setState({
//       focused: id
//     });
//   }

//   const panels = [];
//     (state.focused ? data.filter(panel => state.focused === panel.id) : data).forEach(element => {
//       panels.push(<Panel key={element.id} label={element.label} value={element.value} selectPanel={selectPanel} />);
//     })
//     console.log(panels);
//     return (
//       <main className={dashboardClasses}>
//         {panels}
//       </main>
//     )
//   // return /* JSX */
// }

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.selectPanel = this.selectPanel.bind(this);
  }
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: []
  };

  selectPanel(id) {
    this.setState(prev => ({ focused: prev.focused ? null : id }));
  };

  componentDidMount() {
    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));

    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
    Promise.all(urlsPromise)
    .then(([photos, topics]) => {
      this.setState({
        loading: false,
        photos: photos,
        topics: topics
      });
    });
    
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = [];
    (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data).forEach(element => {
      panels.push(<Panel key={element.id} label={element.label} value={element.getValue(this.state)} selectPanel={() => this.selectPanel(element.id)} />);
    })
    
    return (
      <main className={dashboardClasses}>
        {panels}
      </main>
    )
  }
}

export default Dashboard;
