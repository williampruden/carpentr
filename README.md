# Carpentr
Can't find an easy way to organize your table data without sacrificing all the design?  Neither could we. Introducing Carpentr, a react render prop library that empowers you to handle the look and feel while we take care of the rest. Carpentr is small performant library that fits nicely into any react project. 

## Docs
* [The Install](#the-install)
* [The Basics](#the-basics)
* [The API](#the-api)
* [The "props"](#the-props)


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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Carpentr } from 'carpentr'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentDidMount() {
    axios.get('https://myAPI.com/api/v1/users')
      .then((response) => this.setState(() => ({ users: response.data })))
  }

  render() {
    const renderTable = (props) => {
      return (
        <div>
          <div className='form-row mb-3'>
            <input
              className='form-control'
              placeholder='Search...'
              value={props.search}
              onChange={props.setSearchTerm}/>
          </div>
          <table className='table table-hover mb-4'>
            <thead className='bg-primary text-white'>
              <tr>
                <th name='firstName' onClick={props.setColumnSortToggle}>FirstName</th>
                <th name='lastName' onClick={props.setColumnSortToggle}>LastName</th>
                <th name='dob' onClick={props.setColumnSortToggle}>Date Of Birth</th>
                <th name='occupation' onClick={props.setColumnSortToggle}>Occupation</th>
              </tr>
            </thead>
            <tbody>
              {props.visibleData.map((user, i) => {
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
                  value={props.resultSet}
                  onChange={(e) => { props.setResultSet(parseInt(e.target.value)) }}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                </select>
              </div>
            </div>

            <div className='col-md-6'>
              <ul className='pagination rounded-flat pagination-primary d-flex justify-content-center'>
                <li
                  className={props.prevDisabled ? 'page-item invisible' : 'page-item'}
                  onClick={() => { props.setPageNumber(props.currentPage - 1) }}>
                  <a className='page-link' aria-label='Next'>
                    <span aria-hidden='true'>&laquo;</span>
                    <span className='sr-only'>Previous</span>
                  </a>
                </li>

                {props.paginationButtons.map((page, i) => {
                  return (
                    <li key={i} className={props.currentPage === page ? 'page-item active' : 'page-item'}>
                      <span className='page-link pointer' onClick={() => { props.setPageNumber(page) }}>{page}</span>
                    </li>
                  )
                })}

                <li
                  className={props.nextDisabled ? 'page-item invisible' : 'page-item'}
                  onClick={() => { props.setPageNumber(props.currentPage + 1) }}>
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

            <hr className='mb-4' />
                        
            <Patables
                render={renderTable}
                initialData={this.state.users}
                resultSet={5}
                sortColumn='firstName'
                sortOrder='desc'
                searchKeys={['firstName', 'lastName']} />
          </div>
        </div>
      </div>
    )
  }
}

export default Users
```


## The API
|Prop           |Type   	    |Example   	         |Default  | Required |
|---	          |---	        |---	               |---	     |---       |
|render         |Function     |(props) => {}       |         |true      |
|initialData    |Array      	|[{...},{...},{...}] |         |true      |
|searchKeys     |Array      	|['firstName']       |all keys |          |
|sortColumn     |String      	|"firstName"         |         |          |
|sortOrder      |String      	|"desc"              |"asc"    |          |
|startingPage   |Number      	|2        	         |1        |          |
|pageNeighbors  |Number      	|3         	         |2        |          |
|resultSet      |Number      	|5         	         |10       |          |


#### render
Render takes a function that returns the JSX you wish to render onto the bag. This function is passed a set of methods and values in the form of "props" that you will use to help build your form. To learn more about these "props" skip ahead to the next section to explore whats available

```js
<Patables
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### initialData
This is the array of data you wish to put into a table format. If your data is coming back from an API call inside your `componentDidMount` then pass along that data however you see fit. Patables checks for updates as its given new data and only causes a re-render when it detects new information.

```js
componentDidMount() {
  axios.get('https://myAPI.com/api/v1/resource')
    .then((response) => this.setState(() => ({ data: response.data })))
}

<Patables
  initialData={this.state.data}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### searchKeys
You will be given a method in the next section called `setSearchTerm` that will allow you to do a filter search on the objects retured to you.  By default your search term will be applied to every single `key: value` pair found in each object in your `initialData`. `searchKeys` is a way to specify which keys you want the `searchTerm` to be applied against. In the example below our search will only be looking for matches with the `firstName` and `lastName` and NOT `dob` or `occupation`. It is highly recommended to pass along a value for `searchKeys` to improve the performance of this filter feature.

```js
data = [...users]

<Patables
  sortOrder='desc'
  sortColumn='firstName'
  initialData={this.data}
  searchKeys={['firstName', 'lastName']}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### sortColumn
If you know in advance what column you wish to sort on then you can pass that information along here. Just tell Patables what `key` in each object inside your array of `initialData` you wish to sort on.

```js
data = [
  {
    firstName: 'Jim',
    lastName: 'Halpert'
  },
  {
    firstName: 'Dwight',
    lastName: 'Schrute'
  }
]

<Patables
  sortColumn='firstName'
  initialData={this.data}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### sortOrder
By default Patables will sort your data in `asc` (ascending order). If you wish for it to sort in descending order you are given the ability to do that here.

```js
data = [...users]

<Patables
  sortOrder='desc'
  sortColumn='firstName'
  initialData={this.data}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### startingPage
If for some reason you don't want the table to start on the first page of results you can specify the starting page here.

```js
data = [...users]

<Patables
  startingPage={3}
  initialData={this.data}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### pageNeighbors
Patables will provide to you the pagination logic for your tables. Here is your opportunity to specify how many pages you wish to show up in that pagination array. Some examples:

```js
<Patables
  pageNeighbors={1} // will give you: [1, 2, 3]
  initialData={this.data}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 

<Patables
  pageNeighbors={2} // will give you: [1, 2, 3, 4, 5]
  initialData={this.data}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 

<Patables
  pageNeighbors={3} // will give you: [1, 2, 3, 4, 5, 6, 7]
  initialData={this.data}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```

#### resultSet
By default Patables will return the first 10 results to you to display on the screen.  If you would like to change the default setting just pass your desired return into `resultSet`.

```js
<Patables
  initialData={this.data}
  resultSet={20} // Patables will now return 20 items per page.
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
  ```


## The "props"
The render function as we learned in the previous section is handed a set of methods and values in the form of "props". These props are tools you can use within your JSX to make your life easier. Lets take a look at what you're given.

|Props                |Type   	    |
|---	                |---	        |
|currentPage          |Number       |
|initialData          |Array        |
|nextDisabled         |Boolean    	|
|pageNeighbors        |Number      	|
|paginationButtons    |Array      	|
|prevDisabled         |Boolean    	|
|resultSet            |Number      	|
|search               |String       |
|setSearchTerm        |Function     |
|setColumnSortToggle  |Function    	|
|setPageNumber        |Function    	|
|setResultSet         |Function     |
|sortColumn           |String      	|
|sortOrder            |String      	|
|totalPages           |Number      	|
|visibleData          |Array      	|


#### currentPage
currentPage is the active (or current) page number that the user is on. Great for applying the active class in pagination

```js
{props.paginationButtons.map((page, i) => {
  return (
    <li key={i} className={props.currentPage === page ? 'page-item active' : 'page-item'}>
      <span className='page-link pointer' onClick={() => { props.setPageNumber(page) }}>{page}</span>
    </li>
  )
})}
```


#### initialData
The array of data you passed in before any sorting, or filtering has taken place.


#### nextDisabled / prevDisabled
In pagination its common to have a next / previous buttons. nextDisabled and prevDisabled lets you know if your next or previous buttons ought to be disabled or made invisible as you'll see in my example below.

```js
<ul className='pagination rounded-flat pagination-primary d-flex justify-content-center'>
  <li
    className={props.prevDisabled ? 'page-item invisible' : 'page-item'}
    onClick={() => { props.setPageNumber(props.currentPage - 1) }}>
    <a className='page-link' aria-label='Next'>
      <span aria-hidden='true'>&laquo;</span>
      <span className='sr-only'>Previous</span>
    </a>
  </li>

  {props.paginationButtons.map((page, i) => {
    return (
      <li key={i} className={props.currentPage === page ? 'page-item active' : 'page-item'}>
        <span className='page-link pointer' onClick={() => { props.setPageNumber(page) }}>{page}</span>
      </li>
    )
  })}

  <li
    className={props.nextDisabled ? 'page-item invisible' : 'page-item'}
    onClick={() => { props.setPageNumber(props.currentPage + 1) }}>
    <a className='page-link' aria-label='Next'>
      <span aria-hidden='true'>&raquo;</span>
      <span className='sr-only'>Next</span>
    </a>
  </li>
</ul>
```


#### pageNeighbors
pageNeighbors defaults to 2 but you can set pageNeighbors when creating your instance of `<Patables />`. It allows you to specify how many page buttons you wish to see to the left and right of your active page. This value will directly influence the length of your [paginationButtons](#paginationbuttons).


#### paginationButtons
paginationButtons is an array of the page numbers you need to display in your pagination. A few examples above show how we `.map()` over this array to create our pagination.


#### resultSet
resultSet is how many items will be returned in our [visibleData](#visibledata) array. The default value is 10 however when creating your instance of `<Patables />` you can pass in a new default. If you want to let your user specify the result set then please use the [setResultSet](#setresultset) method


#### search / setSearchTerm
these two go hand in hand as `setSearchTerm` will be the method you use to set the value for `search`.  Both of these values will be passed back in props and can be used like this in your `renderTable` method:

```js
<div className='form-row mb-3'>
  <input
    className='form-control'
    placeholder='Search...'
    value={props.search}
    onChange={props.setSearchTerm}/>
</div>
```


#### setColumnSortToggle
Sorting a table by its columns is a common action a user expects to take. This method requires you set a `name` attribute on the `<th />` tag that is equal to the `key` that that column is displaying. This method toggles between 'asc' and 'desc' orders.

```js
let data = [
  {
    firstName: 'Michael',
    lastName: 'Scott',
    dob: '03-15-1964',
    occupation: 'The Boss',
  }
]

<thead className='bg-primary text-white'>
  <tr>
    <th name='firstName' onClick={props.setColumnSortToggle}>FirstName</th>
    <th name='lastName' onClick={props.setColumnSortToggle}>LastName</th>
    <th name='dob' onClick={props.setColumnSortToggle}>Date Of Birth</th>
    <th name='occupation' onClick={props.setColumnSortToggle}>Occupation</th>
  </tr>
</thead>
```


#### setPageNumber
This method allows you to set a new `currentPage` within your pagination. Examples of this method can be found above.


#### setResultSet
Sometimes you want to give your user the flexibility of setting how many results they wish to see in a given table. This method allows you to give them the ability to do just that.

```js
<div className='form-inline'>
  <label className='my-1 mr-2'>Result set: </label>
  <select
    className='form-control'
    value={props.resultSet}
    onChange={(e) => { props.setResultSet(parseInt(e.target.value)) }}>
    <option>5</option>
    <option>10</option>
    <option>15</option>
  </select>
</div>
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
  {props.visibleData.map((user, i) => {
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
