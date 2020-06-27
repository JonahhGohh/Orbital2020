import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { connect } from 'react-redux';
import Navbar from '../../components/UI/Navbar/Navbar';
import DataTitle from '../../components/DataTitle/DataTitle';
import SummaryTableHead from '../../components/Tables/SummaryTableHead';
import SummaryTableBody from '../../components/Tables/SummaryTableBody';
import AnalysisCard from '../../components/AnalysisCard/AnalysisCard';
import styles from './Home.module.css';
import BarChartIcon from '@material-ui/icons/BarChart';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import * as actions from '../../store/Actions/Analysis';

class Home extends Component {
    state = {
        marketSummaryDataName: ['SPY', 'DBSM.SI'],
        marketSummaryData1: null,
        marketSummaryData2: null,
        analysisSummaryData: null,
        marketSummaryDataError: null,
        analysisSummaryDataError: null,
    };

    componentDidMount() {
        const marketSummaryDataUrl = this.state.marketSummaryDataName.map(
            (stock) => {
                return `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=NSELWN19JOULLJJ9`;
            }
        );
        let promises = [];
        marketSummaryDataUrl.forEach((url) => {
            promises.push(axios.get(url));
        });
        axios
            .all(promises)
            .then(
                axios.spread((...response) => {
                    const response1 = response[0];
                    const response2 = response[1];
                    this.setState({
                        marketSummaryData1: response1['data']['Global Quote'],
                        marketSummaryData2: response2['data']['Global Quote'],
                    });
                })
            )
            .catch((errors) => {
                console.log(errors);
                this.setState({ marketSummaryDataError: true });
            });

        if (this.props.analysisData == null) {
            this.props.onPullAnalysis(this.props.token);
        }
    }

    render() {
        // creating the data for market summary
        const createData = (id, name, price, change, changePercent) => {
            return { id, name, price, change, changePercent };
        };

        let rows = [
            createData(0, 'SPY', 100, -20, -20 + '%'),
            createData(1, 'SPY', 100, -20, -20 + '%'),
        ];

        if (!this.state.marketSummaryDataError) {
            const marketSummaryData1 = this.state.marketSummaryData1;
            const marketSummaryData2 = this.state.marketSummaryData2;
            if (marketSummaryData1 === null || marketSummaryData2 == null) {
            } else {
                rows = [
                    createData(
                        0,
                        marketSummaryData1['01. symbol'],
                        marketSummaryData1['05. price'],
                        marketSummaryData1['09. change'],
                        marketSummaryData1['10. change percent']
                    ),
                    createData(
                        1,
                        marketSummaryData2['01. symbol'],
                        marketSummaryData2['05. price'],
                        marketSummaryData2['09. change'],
                        marketSummaryData2['10. change percent']
                    ),
                ];
            }
        }

        // creating the analysisCard
        const headings = ['Name', 'Price', 'Change', '% Change'];
        let analysisCard = null;
        if (this.props.analysisData !== null) {
            analysisCard = this.props.analysisData.slice(0, 3).map((data) => {
                return (
                    <Grid
                        key={data.id}
                        item
                        xs={6}
                        md={4}
                        container
                        justify="center"
                        style={{ marginBottom: '3em' }}
                    >
                        <AnalysisCard data={data} />
                    </Grid>
                );
            });
        }

        return (
            <React.Fragment>
                <Navbar />
                <Grid container style={{ marginTop: '20px' }}>
                    <Grid container item md={1} />
                    <Grid
                        xs={12}
                        md={6}
                        className={styles.tableBackground}
                        container
                        item
                    >
                        <DataTitle
                            icon={
                                <BarChartIcon
                                    color="primary"
                                    style={{ paddingRight: '10px' }}
                                />
                            }
                        >
                            Market Summary
                        </DataTitle>
                        <Table size="medium">
                            <SummaryTableHead headings={headings} />
                            <SummaryTableBody bodyInfo={rows} />
                        </Table>
                    </Grid>
                    <Grid container item md={4} />
                    <Grid container item md={1} />
                </Grid>
                <Grid container style={{ marginTop: '20px' }}>
                    <Grid container item md={1} />
                    <Grid
                        className={styles.tableBackground}
                        xs={12}
                        md={10}
                        container
                        item
                        direction="row"
                        justify="center"
                        alignContent="center"
                    >
                        <DataTitle
                            icon={
                                <WhatshotIcon
                                    color="primary"
                                    style={{ paddingRight: '10px' }}
                                />
                            }
                        >
                            Featured Posts
                        </DataTitle>
                        {analysisCard}
                    </Grid>
                    <Grid container item md={1} />
                </Grid>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        analysisData: state.analysis.analysisData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onPullAnalysis: (token) => dispatch(actions.analysisData(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
