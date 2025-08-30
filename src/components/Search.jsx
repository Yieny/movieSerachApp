import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {

    return (
        <div className='search'>
            <div>
                <img src='../src/assets/search.svg' alt="search" />
                <input
                    type='text'
                    placeholder='Search through thousands of movies'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)} />
                    <button type="button" class="py-2 px-5 me-2 text-sm font-medium button-cursor
                     text-gray-900 focus:outline-none
                     bg-white rounded-lg border
                     border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100
                     dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white
                     dark:hover:bg-gray-700"
                     onClick={() => setSearchTerm('')}>new search</button>
            </div>
        </div>
    )
}

export default Search