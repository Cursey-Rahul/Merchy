import Image from 'next/image'
import Menu from './menu'
import Link from 'next/link'
import Shopingcart from './Shopingcart'

const header = () => {
  const user =false
 
  return (
 
    <div className='h-12  bg-white text-red-500 flex justify-between px-4 items-center border-b-2 border-b-red-500 md:h-20 lg:px-14'>
      <div className='hidden md:flex items-center gap-5 lg:gap-6 text-l uppercase flex-1 lg:text-xl '>
        <Link href='/' className=' hover:underline hover:font-semibold'>Homepage</Link>
        <Link href='/menu' className=' hover:underline hover:font-semibold'>Menu</Link>
        <Link href='/contact' className=' hover:underline hover:font-semibold'>contact</Link>
      </div>



      <div className='text-xl uppercase md:font-bold font-semibold flex-1 md:text-center'>
        <Link href='/'>
        crimps foods
        </Link>
      </div>



      <div className='hidden md:flex items-center gap-6 text-l uppercase flex-1 justify-end lg:text-xl'>
        <div className=' md:absolute top-4 right-4 xl:static flex items-center gap-2 bg-orange-300 rounded-md px-1 '>
          <Image src='/phone.png' alt='' width={20} height={20} />  
          <span>981896391</span>
        </div>
        {!user? ( <Link href='/login' className=' hover:underline hover:font-semibold'>Login</Link>):(<Link href='/orders' className=' hover:underline hover:font-semibold'>orders</Link>)}
        <Shopingcart/>
      </div>
      <div className='md:hidden '>
        <Menu/>
      </div>
    </div>
  )
}

export default header