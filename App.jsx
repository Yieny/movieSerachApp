import { useEffect, useState } from 'react'
import Search from './components/Search';

import './index.css'
import Spinner from './components/Spinner';
import { MovieCard } from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY} `
  }
};

const App = () => {

  const [debouncedsearch, setDebouncedsearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  
  const [trendingMovies, setTrendingMovies] = useState([])
  useDebounce(() => setDebouncedsearch(searchTerm), 500, [searchTerm]);


  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}‚`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'failed to fetch movies');
        setMovieList([])
        return;
      }
      setMovieList(data.results || []);
      console.log(data.results);
      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
        console.log(data.results[0])
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`)
    } finally {
      setIsLoading(false);
    }

  }
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);

    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }
  useEffect(() => {
    fetchMovies(debouncedsearch);

  }, [debouncedsearch]);

  useEffect(() => {
    loadTrendingMovies();
  })
  return (
    <main>

      <div className='pattern' />
      <div className='wrapper'>
        <header>

          <img src="src/assets/hero.png" alt='hero' />
          <h1>Find <span className='text-gradient'> Movies </span>you´ll enjoy without the Hassle</h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {
                trendingMovies.map((movie, index) => (
                  <li key={movie.id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))
              }
            </ul>
          </section>
        )}
        <section className='all-movies'>
          <h2>All Movies</h2>
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) :
            (
              <ul>
                {movieList.sort((a, b) => new Date(b.release_date).setHours(0,0,0,0) - new Date(a.release_date).setHours(0,0,0,0)).map((movie) => (
                  <MovieCard movie={movie} key={movie.id} />
                ))}
              </ul>
            )}
        </section>
      </div>
    </main>
  )
}
export default App
