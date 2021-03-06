import React from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow }  from '@material-ui/core'

import {GetRecs} from './Search.jsx'

export const NoResult = ({text}) => (
  <TableRow>
    <TableCell style={{borderBottom: 'none'}}>
      {!text ? 'No Results' : text}
    </TableCell>
  </TableRow>
)
NoResult.propTypes = {
  text: PropTypes.string
}

export const Headers = ({columns}) => (
  <TableRow>
    {columns && columns.map((column, i) => (
      <TableCell key={i} style={{...column.style, fontWeight: 600}}>
        {column.header}
      </TableCell>
    ))}
  </TableRow>
)
Headers.propTypes = {
  resultType: PropTypes.string
}

export const ResultContainer = ({ columns,
                                  results,
                                  getRecs,
                                  resultType,
                                  noResultText,
                                  handleClick }) => (
  <Grid container
        direction="row"
        alignItems="flex-start"
        justify="flex-start">
    <Grid item xs={12}>

      <TableContainer>
        <Table aria-label="sticky table">

          {!!resultType && !!results.length && (
            <TableHead>
              <Headers columns={columns[resultType]}/>
            </TableHead>
          )}

          <TableBody>
            {!!resultType && results.map((result, i) => (
              <SearchResult result={result}
                            headers={columns[resultType]}
                            key={i}
                            getRecs={getRecs}
                            handleClick={handleClick}/>
            ))}
            {!!resultType && !results.length && (
              <NoResult text={noResultText}/>
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </Grid>
  </Grid>
)
ResultContainer.propTypes = {
  getRecs: PropTypes.func,
  columns: PropTypes.object,
  resultType: PropTypes.string,
  results: PropTypes.array,
}

export const SearchResult = ({result, headers, getRecs, handleClick}) => (
  <TableRow>
    {headers.map((header, i) => {
      if (header.label == 'review_url') {
        return (
          <TableCell key={i} style={header.style}>
            {result.review_url &&
              <Link href={result.review_url}
                    target="_blank">
                Read Review
              </Link>
            }
          </TableCell>
        )
      } else if (header.label == 'artist_name' ||
          header.label == 'album_name') {
        return (
          <TableCell key={i} style={header.style}>
            <Link href="#" onClick={() => handleClick(result, header['label'])}>
              {result[header['label']]}
            </Link>
          </TableCell>
        )
      } else {
        return (
        <TableCell key={i} style={header.style}>
          {!!header['label'] ?
            result[header['label']] :
            <GetRecs song={result} handleClick={getRecs}/>
          }
        </TableCell>
        )
      }
    })}
  </TableRow>
)
SearchResult.propTypes = {
  result: PropTypes.object,
  headers: PropTypes.array,
  getRecs: PropTypes.func,
  handleClick: PropTypes.func
}
