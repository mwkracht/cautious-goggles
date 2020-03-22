import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useFilters, useGlobalFilters, useTable, useSortBy } from 'react-table'
import * as MotivationActions from '../actions/motivations';
import PageTitle from './PageTitle';


function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {setFilter(e.target.value || undefined)}}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>{option}</option>
      ))}
    </select>
  )
}


function SearchColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {setFilter(e.target.value || undefined)}}
      placeholder={`Search ${count} records...`}
    />
  )
}


function DefaultColumnFilter() {
  return (null);
}


const MotivationsTable = ({ data, columns }) => {
  const defaultColumn = { Filter: DefaultColumnFilter };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      data,
      columns,
      defaultColumn
    },
    useFilters,
    useSortBy,
  )

  return (
    <div className="MotivationsTable table-wrapper">
      <table {...getTableProps()} className="table is-bordered is-striped is-narrow is-fullwidth">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>
                    <span {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted ? column.isSortedDesc ? ' ↓' : ' ↑' : ''}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
    </div>
  )
}

@connect(
  state => ({
    motivations: state.motivations
  }),
  dispatch => ({
    actions: bindActionCreators(MotivationActions, dispatch)
  })
)
export default class Motivations extends Component {

  static propTypes = {
    motivations: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  handleClear = () => {
    const { motivations, actions } = this.props;
    actions.clearMotivations();
  };

  mapData = (motivations) => {
    let results = {
      data: [],
      firstMotivation: null,
      lastMotivation: null,
      totalDays: null
    }

    if ( ! motivations.length ) {
      return results;
    }

    let data_by_player = {};
    results.firstMotivation = new Date(motivations.reduce((min, motivation) => 
      motivation.time < min ? motivation.time : min, motivations[0].time
    ));
    results.lastMotivation = new Date(motivations.reduce((max, motivation) => 
      motivation.time > max ? motivation.time : max, motivations[0].time
    ));
    results.totalDays = Math.abs(results.lastMotivation - results.firstMotivation) / (1000 * 60 * 60 * 24);

    function mapType(motivation) {
      if ( motivation.isFriend ) {
        return 'Friend';
      } else if ( motivation.isNeighbor ) {
        return 'Neighbor';
      } else if ( motivation.isGuildMember ) {
        return 'Guild';
      } else {
        return 'N/A';
      }
    }

    motivations.forEach(function (motivation, index) {
      const { player } = motivation;

      if (player in data_by_player) {
        data_by_player[player].totalMotivations += 1;
      } else {
        data_by_player[player] = {
          type: mapType(motivation),
          totalMotivations: 1
        }
      }
    });

    Object.keys(data_by_player).forEach(function (key, index) {
      results.data.push({
        name: key,
        type: data_by_player[key].type,
        totalMotivations: data_by_player[key].totalMotivations,
        avgMotivations: Math.min(1, data_by_player[key].totalMotivations / results.totalDays)
      })
    });

    return results;
  };

  render() {
    const { motivations } = this.props;
    const { data, firstMotivation, lastMotivation, totalDays } = this.mapData(motivations);
    const totalMotivations = data.reduce((total, row) => total + row.totalMotivations, 0);

    const columns = [
      {
        Header: 'Player',
        accessor: (row) => row.name.length > 21 ? row.name.substring(0, 18) + '...' : row.name,
        Filter: SearchColumnFilter,
        width: 200,
      }, {
        Header: 'Type',
        accessor: 'type',
        Filter: SelectColumnFilter,
        filter: 'includes',
        disableSortBy: true,
      }, {
        Header: 'Avg.',
        accessor: (row) => row.avgMotivations.toFixed(2)
      }
    ];

    return (
      <div className="Motivations">
        <div className='mt-4 mb-4 text-center'>
          <PageTitle
              title='Motivations'
              help='In order to populate motivations table click on your Town Hall, open the News
              tab, and click Event History. The motivations on the current Event History page should
              populate into the table. To populate more motivations, continue clicking through the
              remainder of Event History pages.'
          />
          {data.length > 0 && (
            <table className="table is-bordered is-striped is-narrow">
              <tbody>
                <tr><td>Most Recent</td><td>{lastMotivation.toLocaleString()}</td></tr>
                <tr><td>Oldest</td><td>{firstMotivation.toLocaleString()}</td></tr>
                <tr><td>Total Days</td><td>{totalDays.toFixed(2)}</td></tr>
                <tr><td>Avg. per Day</td><td>{(totalMotivations / totalDays).toFixed(2)}</td></tr>
              </tbody>
            </table>
          )}
          <button onClick={this.handleClear} >Clear All Motivations</button>
        </div>
        <MotivationsTable columns={columns} data={data} />
      </div>
    )
  }
}
