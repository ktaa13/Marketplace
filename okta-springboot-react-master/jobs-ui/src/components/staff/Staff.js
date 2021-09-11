import React, { Component, useEffect } from 'react'
import { withOktaAuth } from '@okta/okta-react'
import { withKeycloak, useKeycloak } from '@react-keycloak/web'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import API from '../misc/api'
import Pagination from '../misc/Pagination'
import Search from '../misc/Search'
import JobList from './JobList'

function Staff(){

  const { keycloak } = useKeycloak()

  const state = {
    jobs: [],
    pagination: {
      first: null,
      last: null,
      number: null,
      size: null,
      totalElements: null,
      totalPages: null
    },
    searchText: ''
  }

  const pageDefaultNumber = 0
  const pageDefaultSize = 10

     
    const floatingActionButton = document.querySelectorAll('.fixed-action-btn')
    M.FloatingActionButton.init(floatingActionButton, {
      direction: 'button'
    })

    getAllJobs(pageDefaultNumber, pageDefaultSize)

   async function getAllJobs (page, size) {
     console.log("token is###############################################"+' '+keycloak.token)
    API.get(`jobs?page=${page}&size=${size}`, {
     headers: { 'Authorization':keycloak.token}
    })
      .then(response => {
        const { content, first, last, number, size, totalElements, totalPages } = response.data
        state({
          jobs: content,
          pagination: {
            first,
            last,
            number,
            size,
            totalElements,
            totalPages
          }
        })
      })
      .catch(error => {
        console.log(":(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(")
        console.log(error)
        M.toast({ html: error, classes: 'rounded' })
      });
    }

  async function getJobsWithText (text, page, size){
    API.put(`jobs/search?page=${page}&size=${size}`, { 'text': text }, {
      headers: {'Authorization': keycloak.token }
    })
      .then(response => {
        const { content, first, last, number, size, totalElements, totalPages } = response.data
        this.setState({
          jobs: content,
          pagination: {
            first,
            last,
            number,
            size,
            totalElements,
            totalPages
          }
        })
      })
      .catch(error => {
        console.log(error)
        M.toast({ html: error, classes: 'rounded' })
      })
  }

  async function deleteJob (id){
    API.delete(`jobs/${id}`, {
      headers: {'Authorization': keycloak.token }
    })
      .then(() => {
        const { number, size } = state.pagination
        this.getAllJobs(number, size)
      })
      .catch(error => {
        console.log(error)
        M.toast({ html: error, classes: 'rounded' })
      })
  }

  async function searchJob (searchText, pageNumber, pageSize) {
    this.setState({ searchText })
    searchText ? getJobsWithText(searchText, pageNumber, pageSize) : getAllJobs(pageNumber, pageSize)
  }

    return (
      <div>
        <div className="container">
          <Search searchJob={searchJob} />

          <Pagination className="center"
            pagination={state.pagination}
            searchText={state.searchText}
            searchJob={searchJob}
          />

          <JobList
            jobs={state.jobs}
            deleteJob={deleteJob}
          />
        </div>

        <div className="fixed-action-btn">
          <Link className="btn-floating btn-large waves-effect waves-light blue"
            to={'/staff/jobs'}>
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div >
    )
  }

export default withKeycloak(Staff)