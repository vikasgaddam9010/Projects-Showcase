import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  initial: 'initial',
  success: 'success',
  loading: 'load',
  failed: 'fail',
}

class ProjectsList extends Component {
  state = {apiState: apiStatus.initial, activeOption: 'ALL'}

  componentDidMount() {
    this.callApi()
  }

  updateActiveOption = event => {
    this.setState({activeOption: event.target.value}, this.callApi)
  }

  callApi = async () => {
    this.setState({apiState: apiStatus.loading})
    const {activeOption} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const jsonData = await response.json()

      this.setState({
        apiState: apiStatus.success,
        projectsList: jsonData.projects,
      })
    } else {
      this.setState({apiState: apiStatus.failed})
    }
  }

  renderFailedView = () => (
    <div className="fail-container">
      <img
        className="fail-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.callApi}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    console.log(projectsList)
    return (
      <ul>
        {projectsList.map(project => (
          <li key={project.id}>
            <img
              alt={project.name}
              className="img-logo"
              src={project.image_url}
            />
            <p>{project.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="fail-container" data-testid="loader">
      <Loader type="ThreeDots" color="BLUE" width={50} height={50} />
    </div>
  )

  renderResult = () => {
    const {apiState} = this.state

    switch (apiState) {
      case apiStatus.loading:
        return this.renderLoadingView()
      case apiStatus.success:
        return this.renderSuccessView()
      case apiStatus.failed:
        return this.renderFailedView()
      default:
        return null
    }
  }

  render() {
    const {activeOption} = this.state
    return (
      <div>
        <nav className="nav">
          <img
            className="img-site-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="select-and-ul-container">
          <select
            className="select"
            value={activeOption}
            onChange={this.updateActiveOption}
          >
            {categoriesList.map(category => (
              <option value={category.id} key={category.displayText}>
                {category.displayText}
              </option>
            ))}
          </select>
          {this.renderResult()}
        </div>
      </div>
    )
  }
}

export default ProjectsList
