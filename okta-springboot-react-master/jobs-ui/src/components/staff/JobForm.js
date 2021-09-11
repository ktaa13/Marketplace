import React, { Component, useState, useEffect } from 'react'
import { withOktaAuth } from '@okta/okta-react'
import { withKeycloak, useKeycloak } from '@react-keycloak/web'

import M from 'materialize-css'
import JobCardHome from '../home/JobCard'
import JobCardCustomer from '../customer/JobCard'
import API from '../misc/api'

function JobForm (props){
  const { keycloak } = useKeycloak()

  const state = {
    id: '',
    title: '',
    company: '',
    logoUrl: '',
    description: '',
    createDate: ''
  }

  

  

  async function handleChange (e) {
    const { id, value } = e.target
    state.id = id
    state.value = value

  }

  function redirectJobList  ()  {
    props.history.push("/staff")
  }

  useEffect(() => {
    const id = props.match.params.job_id
    

    if (id) {
      API.get(`jobs/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + keycloak.accessToken
        }
      })
        .then(response => {
          const job = response.data
          this.setState({
            id: job.id,
            title: job.title,
            company: job.company,
            logoUrl: job.logoUrl,
            description: job.description,
            createDate: job.createDate
          })
        })
        .catch(error => {
          console.log(error)
          M.toast({html: error, classes: 'rounded'})
        })
    }

    M.Tabs.init(document.querySelectorAll('.tabs'))
  }
);
  async function saveJob () {
    if (!validateForm()) {
      return
    }

    const job = state
    let method = 'POST'
    let url = 'http://localhost:9080/api/jobs'
    if (job.id) {
      method = 'PUT'
      url += '/' + job.id
    }

    API.request({
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await keycloak.accessToken
      },
      data: JSON.stringify(job)
    })
      .then(() => {
        this.redirectJobList()
      })
      .catch(error => {
        console.log(error)
        M.toast({html: error, classes: 'rounded'})
      })
  }

  function validateForm() {
    const fields = document.querySelectorAll(".validate")
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value.trim() === "") {
        document.getElementById(fields[i].id).focus()
        return false
      }
    }
    return true
  }

  useEffect (() => {

    // It is needed to avoid labels overlapping prefilled content 
    // Besides, the labels of this form component have "active" className
    M.updateTextFields()

    // It is needed otherwise, on editing, the textarea will start with
    // just 2 lines
    M.textareaAutoResize(document.querySelector('.materialize-textarea'))
  }
)

  function mockJobIdAndCreateDate () {
    let job = { ...state }
    job.id = 'XXXXXXXXXXXXXXXXXXXXXXXX'
    job.createDate = new Date()
    return job
  }

    const job = state.id ? state : mockJobIdAndCreateDate()
    const idFieldVisibility = state.id ? { display: "block" } : { display: "none" }

    const form = (
      <div className="row">
        <form className="col s12">
          <div className="row" style={idFieldVisibility}>
            <div className="input-field col s12">
              <input disabled defaultValue={job.id} id="id" type="text" />
              <label htmlFor="id">Id</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input required className="validate" defaultValue={job.title} id="title" type="text" onChange={handleChange} />
              <span className="helper-text" data-error="Title cannot be empty"></span>
              <label htmlFor="title">Title</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input required className="validate" defaultValue={job.company} id="company" type="text" onChange={handleChange} />
              <span className="helper-text" data-error="Company cannot be empty"></span>
              <label htmlFor="company">Company</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input defaultValue={job.logoUrl} id="logoUrl" type="text" onChange={handleChange} />
              <label htmlFor="logoUrl">Logo Url</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <textarea required className="materialize-textarea validate" id="description" onChange={handleChange} defaultValue={state.description}></textarea>
              <span className="helper-text" data-error="Description cannot be empty"></span>
              <label htmlFor="description" className="active">Description</label>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="input-field col s12">
            <button className="waves-effect waves-green btn-flat right" onClick={saveJob}>Save</button>
            <button className="waves-effect waves-green btn-flat right" onClick={redirectJobList}>Cancel</button>
          </div>
        </div>
      </div>
    )

    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              <li className="tab col s4"><a className="active" href="#form">Form</a></li>
              <li className="tab col s4"><a href="#home-card-preview">Home Card Preview</a></li>
              <li className="tab col s4"><a href="#customer-card-preview">Customer Card Preview</a></li>
            </ul>
          </div>
          <div id="form" className="col s12">
            {form}
          </div>
          <div id="home-card-preview" className="col s12">
            <JobCardHome job={job} />
          </div>
          <div id="customer-card-preview" className="col s12">
            <JobCardCustomer job={job} />
          </div>
        </div>
      </div>
    )
  }

export default withKeycloak(JobForm)