# Carpentr
Can't find an easy way to organize your table data without sacrificing all the design?  Neither could we. Introducing Carpentr, a react hook inspired library that empowers you to handle the look and feel while we take care of the rest. Carpentr is small, performant, and fits nicely into any size react project. 

## Docs
* [The Install](#the-install)
* [The Options](#the-options)
* [The Payload](#the-payload)
* [The 'props'](#the-props)


## The Install
You can install Carpentr with either NPM or Yarn


### NPM
```
$ npm install --save carpentr
```


### Yarn
```
$ yarn add carpentr
```


## The Basics
```js
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Carpentr } from 'carpentr'

const Users = () => {
const data = [
  { firstName: 'Ferris', lastName: 'Bueller', dob: '3-21-1962', occupation: 'student' },
  { firstName: 'Cameron', lastName: 'Frye', dob: '7-1-1956', occupation: 'student' },
  { firstName: 'Sloane', lastName: 'Peterson', dob: '6-19-1967', occupation: 'student' }
]

  const payload = Carpentr({
    initialData: data,
    sortColumn: 'firstName',
    searchKeys: ['firstName', 'lastName']
  })

  render() {
    const renderTable = () => {
      return (
        <div>
          <div className='form-row mb-3'>
            <input
              className='form-control'
              placeholder='Search...'
              value={payload.search}
              onChange={payload.setSearchTerm}/>
          </div>
          <table className='table table-hover mb-4'>
            <thead className='bg-primary text-white'>
              <tr>
                <th name='firstName' onClick={payload.setColumnSortToggle}>FirstName</th>
                <th name='lastName' onClick={payload.setColumnSortToggle}>LastName</th>
                <th name='dob' onClick={payload.setColumnSortToggle}>Date Of Birth</th>
                <th name='occupation' onClick={payload.setColumnSortToggle}>Occupation</th>
              </tr>
            </thead>
            <tbody>
              {payload.visibleData.map((user, i) => {
                return (
                  <tr key={i}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.dob}</td>
                    <td>{user.occupation}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className='row my-4 justify-content-between'>
            <div className='col-md-6'>
              <div className='form-inline'>
                <label className='my-1 mr-2'>Result set: </label>
                <select
                  className='form-control'
                  value={payload.resultSet}
                  onChange={(e) => { payload.setResultSet(parseInt(e.target.value)) }}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                </select>
              </div>
            </div>

            <div className='col-md-6'>
              <ul className='pagination rounded-flat pagination-primary d-flex justify-content-center'>
                <li
                  className={payload.prevDisabled ? 'page-item invisible' : 'page-item'}
                  onClick={() => { payload.setCurrentPage(payload.currentPage - 1) }}>
                  <a className='page-link' aria-label='Next'>
                    <span aria-hidden='true'>&laquo;</span>
                    <span className='sr-only'>Previous</span>
                  </a>
                </li>

                {payload.paginationButtons.map((page, i) => {
                  return (
                    <li key={i} className={payload.currentPage === page ? 'page-item active' : 'page-item'}>
                      <span className='page-link pointer' onClick={() => { payload.setCurrentPage(page) }}>{page}</span>
                    </li>
                  )
                })}

                <li
                  className={payload.nextDisabled ? 'page-item invisible' : 'page-item'}
                  onClick={() => { payload.setCurrentPage(payload.currentPage + 1) }}>
                  <a className='page-link' aria-label='Next'>
                    <span aria-hidden='true'>&raquo;</span>
                    <span className='sr-only'>Next</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-12'>
            <h1>Users</h1>
            {renderTable()}
          </div>
        </div>
      </div>
    )
  }
}

export default Users
```


## The Options
|Prop           |Type   	    |Example   	         |Default  | Required |
|---	          |---	        |---	               |---	     |---       |
|initialData    |Array      	|[{...},{...},{...}] |         |true      |
|search         |String      	|'firstName'         |         |          |
|searchKeys     |Array      	|['firstName']       |all keys |          |
|sortColumn     |String      	|'lastName'          |         |          |
|sortOrder      |String      	|'desc'              |'asc'    |          |
|currentPage    |Number      	|2        	         |1        |          |
|resultSet      |Number      	|20        	         |10       |          |
|pageNeighbors  |Number      	|3         	         |2        |          |


#### initialData
This is the array of data you wish to put into a table format. If your data is coming back from an API call, then pass along that data however you see fit. Patables checks for updates as its given new data and only re-renders when it detects new information.

```js
  const data = [...users] 

  const payload = Carpentr({ initialData: data })
```


#### searchKeys
You will be given a method in the next section called `setSearchTerm` that will allow you to do a filtered search on the objects retured to you. By default your search term will be applied to every single `key: value` pair found in each object in your `initialData`. `searchKeys` is a way to specify which keys you want the `searchTerm` to be applied against. In the example below our search will only be looking for matches with the `firstName` and `lastName` and NOT `dob` or `occupation`. It is highly recommended to pass along a value for `searchKeys` to improve the performance of this filter feature.

```js
  const data = [...users]

  const payload = Carpentr({
    initialData: data,
    searchKeys: ['firstName', 'lastName']
  })
```


#### sortColumn
If you know in advance what column you wish to sort on then you can pass that information along here. Just tell Patables what `key` in each object inside your array of `initialData` you wish to sort on.

```js
  const data = [...users]

  const payload = Carpentr({
    initialData: data,
    searchKeys: ['firstName', 'lastName'],
    sortColumn: 'lastName'
  })
```


#### sortOrder
By default Patables will sort your data in `asc` (ascending order). If you wish for it to sort in descending order you are given the ability to do that here.

```js
  const data = [...users]

  const payload = Carpentr({
    initialData: data,
    searchKeys: ['firstName', 'lastName'],
    sortColumn: 'lastName',
    sortOrder: 'desc'
  })
```


#### currentPage
If for some reason you don't want the table to start on the first page of results you can specify the starting page here. This is helpful for those of you who store your page number as a param in your route.

```js
  const data = [...users]
  const { currentPage } = useParams()

  const payload = Carpentr({
    initialData: data,
    searchKeys: ['firstName', 'lastName'],
    sortColumn: 'lastName',
    sortOrder: 'desc',
    currentPage: currentPage
  })
```


#### pageNeighbors
Patables will provide to you the pagination logic for your tables. Here is your opportunity to specify how many pages you wish to show up in that pagination array. Some examples:

```js
  const data = [...users]

  const payload = Carpentr({
    initialData: data,
    pageNeighbors: 1 // will give you: [1, 2, 3]
  })

  const payload = Carpentr({
    initialData: data,
    pageNeighbors: 2 // will give you: [1, 2, 3, 4, 5]
  })

  const payload = Carpentr({
    initialData: data,
    pageNeighbors: 3 // will give you: [1, 2, 3, 4, 5, 6, 7]
  })
```


#### resultSet
By default Patables will return the first 10 results to you to display on the screen.  If you would like to change the default setting just pass your desired return into `resultSet`.

```js
  const data = [...users]

  const payload = Carpentr({
    initialData: data,
    resultSet: 20
  })
```


## The Payload
By running `Carpentr({...options})` you are returned a Payload with all of the values and helper methods you need to manage your Table.

|Props                |Type   	    |
|---	                |---	        |
|currentPage          |Number       |
|nextDisabled         |Boolean    	|
|prevDisabled         |Boolean    	|
|paginationButtons    |Array      	|
|setCurrentPage       |Function    	|
|resultSet            |Number      	|
|setResultSet         |Function     |
|search               |String       |
|setSearchTerm        |Function     |
|setColumnSortToggle  |Function    	|
|sortColumn           |String      	|
|sortOrder            |String      	|
|totalPages           |Number      	|
|visibleData          |Array      	|


#### currentPage
currentPage is the active (or current) page number that the user is on. Great for applying the active class in pagination

```js
{payload.paginationButtons.map((page, i) => {
  return (
    <li key={i} className={payload.currentPage === page ? 'page-item active' : 'page-item'}>
      <span className='page-link pointer' onClick={() => { payload.setCurrentPage(page) }}>{page}</span>
    </li>
  )
})}
```


#### nextDisabled / prevDisabled
In pagination its common to have a next / previous buttons. nextDisabled and prevDisabled lets you know if your next or previous buttons ought to be disabled or made invisible as you'll see in my example below.

```js
<ul className='pagination rounded-flat pagination-primary d-flex justify-content-center'>
  <li
    className={payload.prevDisabled ? 'page-item invisible' : 'page-item'}
    onClick={() => { payload.setCurrentPage(payload.currentPage - 1) }}>
    <a className='page-link' aria-label='Next'>
      <span aria-hidden='true'>&laquo;</span>
      <span className='sr-only'>Previous</span>
    </a>
  </li>

  {payload.paginationButtons.map((page, i) => {
    return (
      <li key={i} className={payload.currentPage === page ? 'page-item active' : 'page-item'}>
        <span className='page-link pointer' onClick={() => { payload.setCurrentPage(page) }}>{page}</span>
      </li>
    )
  })}

  <li
    className={payload.nextDisabled ? 'page-item invisible' : 'page-item'}
    onClick={() => { payload.setCurrentPage(payload.currentPage + 1) }}>
    <a className='page-link' aria-label='Next'>
      <span aria-hidden='true'>&raquo;</span>
      <span className='sr-only'>Next</span>
    </a>
  </li>
</ul>
```


#### paginationButtons
paginationButtons is an array of the page numbers you need to display in your pagination. A few examples above show how we `.map()` over this array to create our pagination.


#### setCurrentPage
This method allows you to set a new `currentPage` within your pagination. Examples of this method can be found above.


#### resultSet
resultSet is how many items will be returned in our [visibleData](#visibledata) array. The default value is 10 however when creating your instance of `Carpentr()` you can pass in a new default. If you want to let your user specify the result set then please use the [setResultSet](#setresultset) method


#### setResultSet
Sometimes you want to give your user the flexibility of setting how many results they wish to see in a given table. This method allows you to give them the ability to do just that.

```js
<div className='form-inline'>
  <label className='my-1 mr-2'>Result set: </label>
  <select
    className='form-control'
    value={payload.resultSet}
    onChange={(e) => { payload.setResultSet(parseInt(e.target.value)) }}>
    <option>5</option>
    <option>10</option>
    <option>15</option>
  </select>
</div>
```


#### search / setSearchTerm
these two go hand in hand as `setSearchTerm` will be the method you use to set the value for `search`.  Both of these values will be passed back in payload and can be used like this in your `renderTable` method:

```js
<div className='form-row mb-3'>
  <input
    className='form-control'
    placeholder='Search...'
    value={payload.search}
    onChange={payload.setSearchTerm}/>
</div>
```


#### setColumnSortToggle
Sorting a table by its columns is a common action a user expects to take. This method requires you set a `name` attribute on the `<th />` tag that is equal to the `key` that that column is displaying. This method toggles between 'asc' and 'desc' orders.

```js
<thead className='bg-primary text-white'>
  <tr>
    <th name='firstName' onClick={payload.setColumnSortToggle}>FirstName</th>
    <th name='lastName' onClick={payload.setColumnSortToggle}>LastName</th>
    <th name='dob' onClick={payload.setColumnSortToggle}>Date Of Birth</th>
    <th name='occupation' onClick={payload.setColumnSortToggle}>Occupation</th>
  </tr>
</thead>
```


#### sortColumn
If you wish to show your user which column is being sorted this value is being passed back to you so you can manage your css accordingly


#### sortOrder
If you wish to show your user in which direction the column is being sorted this value is being passed back to you so you can manage your css accordingly


#### totalPages
totalPages is a derived value from `initialData / resultSet`. If you wish to tell your user how many pages they potentially need to paginate through then this is your value.


#### visibleData
visibleData is the data you will want to render onto the screen. This data has gone through all of the sorting and filtering.

```js
<tbody>
  {payload.visibleData.map((user, i) => {
    return (
      <tr key={i}>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.dob}</td>
        <td>{user.occupation}</td>
      </tr>
    )
  })}
</tbody>
```
