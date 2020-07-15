import { useState, useEffect } from 'react'

export const Carpentr = ({
  search = '',
  searchKeys = [],
  currentPage = 1,
  resultSet = 10,
  initialData = [],
  sortColumn = '',
  sortOrder = 'asc',
  pageNeighbors = 2
}) => {
  const [$search, $setSearch] = useState(search)
  const [$searchKeys, $setSearchKeys] = useState(searchKeys)
  const [$currentPage, $setCurrentPage] = useState(currentPage)
  const [$resultSet, $setResultSet] = useState(resultSet)
  const [$initialData, $setInitialData] = useState(initialData)
  const [$sortColumn, $setSortColumn] = useState(sortColumn)
  const [$sortOrder, $setSortOrder] = useState(sortOrder)
  const [$pageNeighbors, $setPageNeighbors] = useState(pageNeighbors)
  const [$totalPages, $setTotalPages] = useState(Math.ceil(initialData.length / resultSet))

  useEffect(() => {
    $setInitialData(initialData)
    if (initialData.length > 0) {
      $setTotalPages(Math.ceil(initialData.length / $resultSet))
    }
  }, [initialData])

  // SEARCHING
  const setSearchTerm = (e) => {
    $setSearch(e.target.value)
  }

  const searchFilter = (arr, searchTerm, searchkeys) => {
    // if searchkeys aren't provided use the keys off the first object in array by default
    const searchKeys = (searchkeys.length === 0 && arr.length > 0) ? Object.keys(arr[0]) : searchkeys
    const filteredArray = arr.filter((obj) => {
      return searchKeys.some((key) => {
        if (obj[key] === null || obj[key] === undefined) { return false }
        return obj[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    })

    // Resetting the total pages based on filtered data
    const totalPages = Math.ceil(filteredArray.length / $resultSet)
    if (totalPages !== $totalPages) {
      $setTotalPages(totalPages)
      $setCurrentPage(1)
    }

    return filteredArray
  }

  // SORTING
  const sortByColumn = (array) => {
    const order = $sortOrder.toLowerCase()

    return array.sort((a, b) => {
      let x = a[$sortColumn]
      let y = b[$sortColumn]

      if (typeof x === 'string') { x = ('' + x).toLowerCase() }
      if (typeof y === 'string') { y = ('' + y).toLowerCase() }

      if (order === 'desc') {
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      } else {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      }
    })
  }

  const setColumnSortToggle = (e) => {
    const sortColumn = e.target.getAttribute('name')
    let sortOrder = $sortOrder
    if (sortColumn === $sortColumn) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      sortOrder = 'asc'
    }
    $setSortColumn(sortColumn)
    $setSortOrder(sortOrder)
  }

  // RESULT SET
  const setResultSet = (value) => {
    let resultSet = value

    if (typeof resultSet === 'string') {
      resultSet = parseInt(resultSet)
    }

    const totalPages = Math.ceil($initialData.length / resultSet)
    const currentPage = totalPages >= $currentPage ? $currentPage : 1
    $setResultSet(resultSet)
    $setTotalPages(totalPages)
    $setCurrentPage(currentPage)
  }

  // VISIBLE DATA
  const getVisibleData = () => {
    const offset = ($currentPage - 1) * parseInt($resultSet)
    const topOfRange = offset + parseInt($resultSet)
    let visible = $initialData

    // searchFilter will return a result set where the searchTerm matches the designated $searchKeys
    if ($search !== '') {
      visible = searchFilter(visible, $search, $searchKeys)
    } else {
      const totalPages = Math.ceil($initialData.length / $resultSet)
      if (totalPages !== $totalPages) {
        $setTotalPages(totalPages)
        $setCurrentPage(1)
      }
    }

    // sortByColumn will return a result set which is ordered by sortColumn and sortOrder
    if ($sortColumn !== '') {
      visible = sortByColumn(visible)
    }

    // reducing the result set down to one page worth of data
    return visible.filter((d, i) => {
      const visibleData = i >= offset && i < topOfRange
      return visibleData
    })
  }

  // PAGINATION
  const range = (start, end, step = 1) => {
    let i = start
    const range = []

    while (i <= end) {
      range.push(i)
      i += step
    }

    return range
  }

  const getPagination = () => {
    const totalNumbers = ($pageNeighbors * 2) + 1
    let pages = []

    if ($totalPages > totalNumbers) {
      let startPage, endPage

      if ($currentPage <= ($pageNeighbors + 1)) {
        startPage = 1
        endPage = ($pageNeighbors * 2) + 1
      } else if ($currentPage > ($totalPages - $pageNeighbors)) {
        startPage = $totalPages - (($pageNeighbors * 2))
        endPage = $totalPages
      } else {
        startPage = $currentPage - $pageNeighbors
        endPage = $currentPage + $pageNeighbors
      }

      pages = range(startPage, endPage)
    } else {
      pages = range(1, $totalPages)
    }

    return pages
  }

  return {
    search: $search,
    currentPage: $currentPage,
    resultSet: $resultSet,
    sortColumn: $sortColumn,
    sortOrder: $sortOrder,
    totalPages: $totalPages,
    setColumnSortToggle,
    setCurrentPage: $setCurrentPage,
    setResultSet,
    setSearchTerm,
    nextDisabled: $totalPages === $currentPage,
    prevDisabled: $currentPage === 1,
    visibleData: getVisibleData(),
    paginationButtons: getPagination()
  }
}
