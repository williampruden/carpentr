import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual, isFunction } from './utils/helpers'

export class Patables extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      searchKeys: this.props.searchKeys || [],
      currentPage: this.props.startingPage || 1,
      resultSet: this.props.resultSet || 10,
      totalPages: Math.ceil(this.props.initialData.length / this.props.resultSet),
      initialData: this.props.initialData || [],
      sortColumn: this.props.sortColumn || '',
      sortOrder: this.props.sortOrder || 'asc',
      pageNeighbors: this.props.pageNeighbors || 2
    }

    this.setSearchTerm = this.setSearchTerm.bind(this)
    this.searchFilter = this.searchFilter.bind(this)
    this.sortByColumn = this.sortByColumn.bind(this)
    this.setColumnSortToggle = this.setColumnSortToggle.bind(this)
    this.setPageNumber = this.setPageNumber.bind(this)
    this.setResultSet = this.setResultSet.bind(this)
    this.getVisibleData = this.getVisibleData.bind(this)
    this.range = this.range.bind(this)
    this.getPagination = this.getPagination.bind(this)
    this.getRenderProps = this.getRenderProps.bind(this)
  }

  // LIFECYCLE METHODS
  componentDidMount() {
    if (this.state.initialData.length > 0) {
      let totalPages = Math.ceil(this.state.initialData.length / this.state.resultSet)
      this.setState(() => ({ totalPages }))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.initialData, this.props.initialData)) {
      let initialData = this.props.initialData
      let totalPages = Math.ceil(initialData.length / this.state.resultSet)
      this.setState(() => ({ initialData, totalPages }))
    }
  }

  // SEARCHING
  setSearchTerm(e) {
    let search = e.target.value
    this.setState(() => ({ search }))
  }

  searchFilter(arr, searchTerm, searchkeys) {
    // if searchkeys aren't provided use the keys off the first object in array by default
    let searchKeys = searchkeys.length === 0 ? Object.keys(arr[0]) : searchkeys
    let filteredArray = arr.filter((obj) => {
      return searchKeys.some((key) => {
        if (obj[key] === null || obj[key] === undefined) { return false }
        return obj[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    })

    // Resetting the total pages based on filtered data
    let totalPages = Math.ceil(filteredArray.length / this.state.resultSet)
    console.log('totalPages: ', totalPages)
    console.log('filteredArray: ', filteredArray)
    if (totalPages !== this.state.totalPages) {
      this.setState(() => ({ totalPages, currentPage: 1 }))
    }

    return filteredArray
  }

  // SORTING
  sortByColumn(array) {
    let order = this.state.sortOrder.toLowerCase()

    return array.sort((a, b) => {
      var x = a[this.state.sortColumn]
      var y = b[this.state.sortColumn]

      if (typeof x === 'string') { x = ('' + x).toLowerCase() }
      if (typeof y === 'string') { y = ('' + y).toLowerCase() }

      if (order === 'desc') {
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      } else {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      }
    })
  }

  setColumnSortToggle(e) {
    let sortColumn = e.target.getAttribute('name')
    let sortOrder = this.state.sortOrder
    if (sortColumn === this.state.sortColumn) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      sortOrder = 'asc'
    }
    this.setState(() => ({ sortColumn, sortOrder }))
  }

  // CURRENT PAGE
  setPageNumber(currentPage) {
    this.setState(() => ({ currentPage }))
  }

  // RESULT SET
  setResultSet(value) {
    let resultSet = value

    if (typeof resultSet === 'string') {
      resultSet = parseInt(resultSet)
    }

    let totalPages = Math.ceil(this.state.initialData.length / resultSet)
    let currentPage = totalPages >= this.state.currentPage ? this.state.currentPage : 1
    this.setState(() => ({ resultSet, totalPages, currentPage }))
  }

  // VISIBLE DATA
  getVisibleData() {
    let { initialData, currentPage, resultSet, search, searchKeys } = this.state
    let offset = (currentPage - 1) * parseInt(resultSet)
    let topOfRange = offset + parseInt(resultSet)

    // searchFilter will return a result set where the searchTerm matches the designated searchKeys
    if (this.state.search !== '') {
      initialData = this.searchFilter(initialData, search, searchKeys)
    } else {
      let totalPages = Math.ceil(initialData.length / this.state.resultSet)
      if (totalPages !== this.state.totalPages) {
        this.setState(() => ({ totalPages, currentPage: 1 }))
      }
    }

    // sortByColumn will return a result set which is ordered by sortColumn and sortOrder
    if (this.state.sortColumn !== '') {
      initialData = this.sortByColumn(initialData)
    }

    // reducing the result set down to one page worth of data
    return initialData.filter((d, i) => {
      const visibleData = i >= offset && i < topOfRange
      return visibleData
    })
  }

  // PAGINATION
  range(start, end, step = 1) {
    let i = start
    const range = []

    while (i <= end) {
      range.push(i)
      i += step
    }

    return range
  }

  getPagination() {
    const { currentPage, totalPages, pageNeighbors } = this.state
    const totalNumbers = (pageNeighbors * 2) + 1
    let pages = []

    if (totalPages > totalNumbers) {
      let startPage, endPage

      if (currentPage <= (pageNeighbors + 1)) {
        startPage = 1
        endPage = (pageNeighbors * 2) + 1
      } else if (currentPage > (totalPages - pageNeighbors)) {
        startPage = totalPages - ((pageNeighbors * 2))
        endPage = totalPages
      } else {
        startPage = currentPage - pageNeighbors
        endPage = currentPage + pageNeighbors
      }

      pages = this.range(startPage, endPage)
    } else {
      pages = this.range(1, totalPages)
    }

    return pages
  }

  // CREATING PROPS
  getRenderProps() {
    return {
      ...this.state,
      setColumnSortToggle: this.setColumnSortToggle,
      setPageNumber: this.setPageNumber,
      setResultSet: this.setResultSet,
      setSearchTerm: this.setSearchTerm,
      nextDisabled: this.state.totalPages === this.state.currentPage,
      prevDisabled: this.state.currentPage === 1,
      visibleData: this.getVisibleData(),
      paginationButtons: this.getPagination()
    }
  }

  render() {
    const { children, render } = this.props
    const renderProps = this.getRenderProps()

    const renderComp = () => {
      if (render && isFunction(render)) {
        return render(renderProps)
      } else if (children && isFunction(children)) {
        return children(renderProps)
      } else {
        console.warn('Please provide a valid render prop or child.')
        return undefined
      }
    }

    return (
      <div>
        {renderComp()}
      </div>
    )
  }
}

Patables.propTypes = {
  render: PropTypes.func,
  children: PropTypes.func,
  initialData: PropTypes.array.isRequired,
  resultSet: PropTypes.number,
  startingPage: PropTypes.number,
  sortColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  pageNeighbors: PropTypes.number,
  searchKeys: PropTypes.array
}
