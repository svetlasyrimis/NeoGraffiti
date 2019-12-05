import React from 'react';
import './App.css';
import { withRouter, Route } from 'react-router-dom';
import { loginUser, signUpUser, verifyUser, readAllPosts, createPost } from './services/api-helper'
import Header from './components/Header'
import Footer from './components/Footer'
import LogInForm from './components/LogInForm'
import SignUpForm from './components/SignUpForm'
import Lander from './components/Lander'
import MainPage from './components/MainPage';
import SideBar from './components/SideBar';
import Suggestions from './components/Suggestions';
import SingleImage from './components/SingleImage';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';

class App extends React.Component {

  state = {
    posts: [],
    currentUser: null,
    postFormData: {
      image: '',
      content: '',
      user_id: ''
    },
    commentFormData: {
      content: '',
      user_id: '',
      post_id: ''
    },
    authFormData: {
      username: '',
      password: '',
      email: '',
      full_name: '',
      image: '',
      bio: '',
      user_id: ''
    }
  }

  async componentDidMount() {
    const posts = await readAllPosts()
    this.setState({
      posts
    })
    const currentUser = await verifyUser();
    if (currentUser) {
      this.setState({ currentUser })
      this.setState({
        postFormData: {
          user_id: this.state.currentUser.id
        }
      })
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const formData = this.state.postFormData
    await createPost(this.state.currentUser.id, formData)
    this.props.history.push('/')
  }

  handleLogin = async () => {
    const currentUser = await loginUser(this.state.authFormData);
    this.setState({ currentUser });
    this.props.history.push("/")
  }

  handleSignUp = async () => {
    const currentUser = await signUpUser(this.state.authFormData);
    this.setState({ currentUser });
    this.props.history.push("/")
  }

  handleLogout = () => {
    localStorage.removeItem("authToken");
    this.setState({
      currentUser: null
    })
    this.props.history.push("/")
  }

  authHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      authFormData: {
        ...prevState.authFormData,
        [name]: value
      }
    }));
  }

  render() {
    return (
      <div className="App" >
        {
          this.state.currentUser != null ?
            <Route exact path='/' render={() => (
              <div>
                <Header
                  currentUser={this.state.currentUser}
                  handleLogout={this.handleLogout}
                />
                <MainPage posts={this.state.posts} />
                <SideBar
                  currentUser={this.state.currentUser}
                />
                <Suggestions />
              </div>
            )} />
            :
            <Route exact path='/' render={() => (
              <div>
                <Lander />
                <LogInForm
                  handleLogin={this.handleLogin}
                  handleChange={this.authHandleChange}
                  formData={this.state.authFormData}
                  handleLoginButton={this.handleLoginButton}
                />
              </div>
            )} />
        }
        <Route exact path='/posts/:postId' render={(props) => (
          <div>
            <Header
              currentUser={this.state.currentUser}
              handleLogout={this.handleLogout}
            />
            <SingleImage
              currentUser={this.state.currentUser}
              postId={props.match.params.postId}
            />
          </div>
        )} />
        <Route exact path='/posts/:postId/edit' render={(props) => (
          <div>
            <Header
              currentUser={this.state.currentUser}
              handleLogout={this.handleLogout}
            />
            <EditPost
              currentUser={this.state.currentUser}
              postId={props.match.params.postId}
            />
          </div>
        )} />
        <Route exact path='/accounts/:userId' render={(props) => (
          <div>
            <Header
              currentUser={this.state.currentUser}
              handleLogout={this.handleLogout}
            />
            <Profile
              currentUser={this.state.currentUser}
              userId={props.match.params.userId}
            />
          </div>
        )} />
        <Route exact path='/accounts/:userId/add' render={() => (
          <div>
            <Header
              currentUser={this.state.currentUser}
              handleLogout={this.handleLogout}
            />
            <CreatePost
              formData={this.state.postFormData}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
            />
          </div>
        )} />
        <Route exact path='/accounts/:userId/edit' render={(props) => (
          <EditProfile
            currentUser={this.state.currentUser}
            userId={props.match.params.userId}
          />
        )} />
        < Route path='/login' render={() => (
          <LogInForm
            handleLogin={this.handleLogin}
            handleChange={this.authHandleChange}
            formData={this.state.authFormData}
            handleLoginButton={this.handleLoginButton}
          />
        )} />
        < Route path='/signup' render={() => (
          <SignUpForm
            handleSignUp={this.handleSignUp}
            handleChange={this.authHandleChange}
            formData={this.state.authFormData}
            handleLoginButton={this.handleLoginButton}
          />
        )} />
        < Footer />
      </div >
    )
  }
}
export default withRouter(App);