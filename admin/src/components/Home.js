import React, { Component } from 'react'

import { Image,} from 'react-bootstrap'


class Home extends Component {


    componentDidMount() {

    }


    render() {
        return (
            <div style={{ width: '100%' }}>
                <Image style={{ width: '100%' }} src={require("../images/busbg.jpg")} />
            </div>
        );
    }
}

export default Home;