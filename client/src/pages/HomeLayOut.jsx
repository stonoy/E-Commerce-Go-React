import React from 'react'
import { Outlet } from 'react-router-dom';
import { Footer, Header, Loader, Navbar } from '../components';
import {useNavigation} from 'react-router-dom'

const HomeLayOut = () => {
 const navigation = useNavigation()
const isLoading = navigation.state == "loading"

  return (
    <>
    <Header/>
    <Navbar/>
      {
        isLoading ?
        <Loader />
        :
        <section className='align-element py-10'><Outlet/></section>
      }
    <Footer/>
    </>
  )
}

export default HomeLayOut