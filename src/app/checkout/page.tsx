import { Input } from '@/components/ui/input'
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faMoneyCheckDollar} from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faGooglePay } from "@fortawesome/free-brands-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { faAmazonPay, faApplePay } from "@fortawesome/free-brands-svg-icons";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

const checkout = () => {
  const total = 100;

  return (
    <div className='flex flex-col items-center justify-center h-screen p-32 '>
        <div className='flex flex-col justify-center w-full  p-12 bg-gray-200 rounded-lg shadow-md gap-5'>
            <p className='text-3xl font-bold text-center'>Amount ${total}</p>
           
            <p className='text-2xl'>Shipping Information</p>
            <div className='flex flex-col gap-2'>
                <p className='text-lg mx-2'>Email</p>
                <Input type="email" placeholder="Email" className=' border border-gray-900'/>
                <Input type="text" placeholder="Phone Number" className=' border border-gray-900'/>
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-lg mx-2'>Shipping Address</p>
                <Input type="Text" placeholder="United States of America" className=' border border-gray-900' />
            </div>
             <div className='flex flex-col gap-1'>
                <p className='text-lg mx-2'>Payment Method</p>
                <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue=""
    >
      <AccordionItem value="item-1">
        <AccordionTrigger><span className='flex flex-row gap-1 items-center justify-center'><FontAwesomeIcon icon={faCreditCard} size='xl' /> Credit / Debit Card</span></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance bg-white p-6 rounded-lg shadow-md">
            <div>
                <p>Card Number</p>
                <Input type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div className='flex flex-row gap-4'>
                <div className='w-1/2'>
                    <p>Expiry Date</p>
                    <Input type="text" placeholder="MM/YY" />
                </div>
                <div className='w-1/2'>
                    <p>CVV</p>
                    <Input type="text" placeholder="123" />
                </div>
            </div>
            <div className='flex flex-row gap-4'>
                <div className='w-1/2'>
                    <p>Cardholder Name</p>
                    <Input type="text" placeholder="John Doe" />
                </div>
                <div className='w-1/2'>
                    <p>Postal Code</p>
                    <Input type="text" placeholder="12345" />
                </div>
            </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger><span className='flex flex-row gap-1 items-center justify-center'><FontAwesomeIcon icon={faMoneyCheckDollar} size='xl' />UPI / Online Payment</span></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
            <Button className='h-10'><span className='flex flex-row gap-1 items-center justify-center'><FontAwesomeIcon icon={faGooglePay} size='2xl'/></span></Button>
            <Button className='h-10'><span className='flex flex-row gap-1 items-center justify-center'><FontAwesomeIcon icon={faPaypal}  size='2xl' />PayPal</span></Button>
            <Button className='h-10'><span className='flex flex-row gap-1 items-center justify-center'><FontAwesomeIcon icon={faAmazonPay}  size='2xl'/></span></Button>
            <Button className='h-10'><span className='flex flex-row gap-1 items-center justify-center'><FontAwesomeIcon icon={faApplePay} size='2xl' /></span></Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger><span> <FontAwesomeIcon icon={faBuildingColumns} size='xl' /> Net Banking</span></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Button className='text-white' variant='destructive'>Comming soon...</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
            </div>
            <Button className='bg-red-500 text-white p-2 rounded-lg text-base text-nowrap uppercase px-14 mx-4'>
              <span className='text-white'>Place Order</span>   
            </Button>
            <p className='text-sm text-gray-500'>By placing an order, you agree to our  <Link href="/terms" className='text-blue-500 underline'>Terms & Conditions</Link> and   <Link href="/privacy" className='text-blue-500 underline'>Privacy Policy</Link>.</p>       

        </div>
    </div>
  )
}

export default checkout