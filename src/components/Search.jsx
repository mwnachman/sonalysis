/* global process:false */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputBase,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import { ResultContainer } from './Display.jsx'
import Recommendations from './Recommendations.jsx'

import {columns} from '../constants/constants'
import useStyles from '../style/search'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

export const GetRecs = ({song, handleClick}) => {
  function selectSong(e) {
    e.preventDefault()
    handleClick(song)
  }

  return (
    <Button variant="outlined"
            color="primary"
            disableElevation
            style={{padding: '7px'}}
            onClick={selectSong}>
      Get Recs
    </Button>
  )
}
GetRecs.propTypes = {
  handleClick: PropTypes.func,
  song: PropTypes.object
}


const SearchForm = ({ query,
                      styles,
                      handleChange,
                      searchTerm,
                      radioValue,
                      handleRadioChange }) => (
  <Grid container
        direction="row"
        alignItems="flex-start"
        justify="flex-start">
    <Grid item xs={12}>
      <Grid container
        direction="row"
        alignItems="flex-start"
        justify="flex-start">

        <form onSubmit={query}>
          <FormControl className={styles.form}>
            <Grid item xs={6} >
              <SearchBase styles={styles}
                          handleChange={handleChange}
                          searchTerm={searchTerm}/>
            </Grid>
            <Grid item xs={6} style={{minWidth: "100%"}}>
              <RadioGroup row
                          name="search"
                          value={radioValue}
                          onChange={handleRadioChange}>
                {['Song', 'Artist', 'Album'].map((item, i) => (
                  <FormControlLabel value={item.toLowerCase()}
                                    control={<Radio color="primary" />}
                                    key={i}
                                    label={item}
                                    labelPlacement="start"/>
                ))}
              </RadioGroup>
            </Grid>
          </FormControl>
        </form>

      </Grid>
    </Grid>
  </Grid>
)
SearchForm.propTypes = {
  query: PropTypes.func,
  styles: PropTypes.object,
  handleChange: PropTypes.func,
  searchTerm: PropTypes.string,
  radioValue: PropTypes.string,
  handleRadioChange: PropTypes.func
}

const SearchBase = ({styles, handleChange, searchTerm}) => (
  <div className={styles.search} >
    <div className={styles.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase placeholder='Search...'
               id='search-field'
               autoComplete='off'
               value={searchTerm}
               classes={{
                 root: styles.inputRoot,
                 input: styles.inputTypeSearch
               }}
               inputProps={{ 'aria-label': 'search' }}
               onChange={handleChange}/>
  </div>
)
SearchBase.propTypes = {
  handleChange: PropTypes.func,
  search: PropTypes.func,
  searchTerm: PropTypes.string,
  styles: PropTypes.object
}


const SearchWrapper = props => {
  const styles = useStyles()
  return <SearchCard styles={styles} {...props} />
}

class SearchCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      searchResults: [],
      resultsType: '',
      radioValue: 'song',
      showRecs: false,
      selectedSong: {},
    }
  }

  handleChange = ({target: {value}}) => {
    this.setState({searchTerm: value})
  }

  handleRadioChange = ({target: {value}}) => {
    this.setState({radioValue: value})
  }

  getRecs = selectedSong => {
    this.setState({selectedSong, showRecs: true})
  }

  query = e => {
    e.preventDefault();
    switch (this.state.radioValue) {
      case 'artist':
        this.search('artist', 'searchArtist')
        break
      case 'album':
        this.search('album', 'searchAlbum')
        break
      case 'song':
        this.search('song', 'searchSong')
        break
      default:
        console.error(`Error`)
    }
  }

  async search(resultType, searchType) {
    const promise = await axios.get(`${APIRoot}/${searchType}/${this.state.searchTerm}`)
    const status = promise.status
    if (status == 200) {
      const searchResults = promise.data
      this.setState({searchResults})
    }
    this.setState({ searchTerm: "", showRecs: false, resultType })
  }

  render() {
    const { styles, handleClick } = this.props
    const { radioValue,
            resultType,
            searchTerm,
            searchResults,
            showRecs,
            selectedSong } = this.state
    return (

      <CardContent>
        <Grid container
              direction="column"
              alignItems="flex-start"
              justify="flex-start">
          <Grid item xs={12}>
            <Typography gutterBottom variant="h5" component="h2">
              Search for an album, artist or song...
            </Typography>
          </Grid>
        </Grid>

        <SearchForm query={this.query}
                    styles={styles}
                    handleChange={this.handleChange}
                    searchTerm={searchTerm}
                    radioValue={radioValue}
                    handleRadioChange={this.handleRadioChange}/>
        
        {showRecs ?
          <Recommendations getRecs={this.getRecs}
                            handleClick={handleClick}
                            selectedSong={selectedSong}/> 
          :
          <ResultContainer columns={columns}
                            results={searchResults}
                            getRecs={this.getRecs}
                            resultType={resultType}
                            handleClick={handleClick}/>
        }

      </CardContent>
    )
  }
}
SearchCard.propTypes = {
  styles: PropTypes.object
}

export default SearchWrapper
