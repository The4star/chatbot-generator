import React from 'react'

const paperclip = <svg id="paperclip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
const sendButton = <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.7083 17.0001C33.7083 16.7183 33.5402 16.4636 33.2814 16.3527L10.876 6.75022C10.6196 6.64035 10.3226 6.69211 10.1184 6.8822C9.91433 7.07229 9.84165 7.36491 9.93303 7.62841L13.1832 17L9.93306 26.3715C9.84441 26.6271 9.91012 26.9101 10.1003 27.1003C10.1062 27.1062 10.1123 27.112 10.1185 27.1177C10.3225 27.3078 10.6196 27.3596 10.8759 27.2497L33.2813 17.6474C33.5403 17.5364 33.7083 17.2818 33.7083 17.0001ZM11.7863 8.67301L29.5724 16.2957L14.4299 16.2956L11.7863 8.67301ZM11.7863 25.327L14.43 17.7043L29.5725 17.7044L11.7863 25.327Z"/></svg>
const chatbotButton = <svg width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.6902 0C6.98554 0 5.56647 1.37655 5.56647 3.08046V4.6153H3.12373C1.41907 4.6153 0 6.00058 0 7.7174V16.9913C0 18.7081 1.41907 20.0934 3.12373 20.0934H3.28585V24.9032C3.28402 25.0459 3.32635 25.1857 3.40704 25.3034C3.48774 25.4211 3.60284 25.5109 3.73659 25.5606C3.87034 25.6103 4.01619 25.6175 4.15415 25.5811C4.29211 25.5447 4.41544 25.4664 4.50725 25.3572L9.06849 20.0934H21.7471C23.4518 20.0934 24.8709 18.7017 24.8709 16.9913V15.4565H27.3136C29.0182 15.4565 30.4373 14.0734 30.4373 12.376V3.08046C30.4373 1.38304 29.0182 0 27.3136 0H8.6902ZM8.6902 1.38352H27.3136C28.2721 1.38352 29.0538 2.14857 29.0538 3.08046V12.376C29.0538 13.3078 28.2721 14.0729 27.3136 14.0729H24.8709V7.7174C24.8709 6.00698 23.4518 4.6153 21.7471 4.6153H6.94998V3.08046C6.94998 2.15506 7.73174 1.38352 8.6902 1.38352ZM6.46361 10.6466C7.51743 10.6466 8.38756 11.5042 8.38756 12.5489C8.38756 13.5937 7.51747 14.4513 6.46361 14.4513C5.40974 14.4513 4.51804 13.6056 4.51804 12.5489C4.51804 11.4923 5.40974 10.6466 6.46361 10.6466ZM12.2571 10.6466C13.3191 10.6466 14.2026 11.5042 14.2026 12.5489C14.2026 13.5937 13.3191 14.4513 12.2571 14.4513C11.2032 14.4513 10.3331 13.5937 10.3331 12.5489C10.3331 11.5042 11.2032 10.6466 12.2571 10.6466ZM18.0505 10.6466C19.1032 10.6466 19.9853 11.494 19.9853 12.5489C19.9853 13.6038 19.1032 14.4513 18.0505 14.4513C16.9979 14.4513 16.1158 13.6038 16.1158 12.5489C16.1158 11.494 16.9979 10.6466 18.0505 10.6466Z"/></svg>
const closeIcon = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.01485 7.49953L14.6862 1.82878C15.1052 1.40983 15.1052 0.73249 14.6862 0.31348C14.2673 -0.10547 13.5899 -0.10547 13.1709 0.31348L7.49955 5.98483L1.8288 0.31348C1.40985 -0.10547 0.732513 -0.10547 0.313503 0.31348C-0.105507 0.73243 -0.105447 1.40977 0.313503 1.82878L5.98485 7.49953L0.313503 13.1709C-0.105447 13.5898 -0.105447 14.2672 0.313503 14.6862C0.522678 14.8948 0.796908 14.9996 1.07112 14.9996C1.34534 14.9996 1.61955 14.8948 1.82874 14.6862L7.49949 9.01483L13.1708 14.6862C13.38 14.8948 13.6542 14.9996 13.9285 14.9996C14.2027 14.9996 14.4769 14.8948 14.6861 14.6862C15.105 14.2672 15.105 13.5899 14.6861 13.1709L9.01473 7.49953"/></svg>
const menuButton = <svg width="5" height="14" viewBox="0 0 5 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.727154 1.69697C0.727154 2.63412 1.48697 3.39394 2.42412 3.39394C3.36128 3.39394 4.12109 2.63412 4.12109 1.69697C4.12109 0.759818 3.36128 0 2.42412 0C1.48697 0 0.727154 0.759818 0.727154 1.69697Z"/><path d="M0.727154 7.00007C0.727154 7.93722 1.48697 8.69704 2.42412 8.69704C3.36128 8.69704 4.12109 7.93722 4.12109 7.00007C4.12109 6.06292 3.36128 5.3031 2.42412 5.3031C1.48697 5.3031 0.727154 6.06292 0.727154 7.00007Z"/><path d="M0.727154 12.303C0.727154 13.2402 1.48697 14 2.42412 14C3.36128 14 4.12109 13.2402 4.12109 12.303C4.12109 11.3659 3.36128 10.6061 2.42412 10.6061C1.48697 10.6061 0.727154 11.3659 0.727154 12.303Z"/></svg>
const linkOut = <svg width="14px" height="14px" style={{marginLeft: "10px"}} fill="#0052c2" xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox="0 0 13 12" id="rpl_icon_arrow_right_primary"><path fillRule="evenodd" clipRule="evenodd" d="M11.74 5.326l-4.546-5A1.003 1.003 0 005.781.259a1.001 1.001 0 00-.066 1.413l3.024 3.327H1a1 1 0 100 2h7.739l-3.024 3.327a1.001 1.001 0 00.739 1.673 1 1 0 00.74-.327l4.546-5a1 1 0 000-1.346z"></path></svg>
const printIcon = <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1733 3.57907H17.0152V1.1093V0.94186V0H3.00662V0.92093V1.08837V3.55814H1.84851C0.824035 3.55814 0 4.33256 0 5.29535V11.8674C0 12.8302 0.824035 13.6047 1.84851 13.6047H2.31621V18H13.7859L17.6834 14.3372V13.6256H18.151C19.1755 13.6256 19.9996 12.8512 19.9996 11.8884V5.31628C20.0218 4.35349 19.1978 3.57907 18.1733 3.57907ZM4.16472 1.1093H15.8348V3.57907H4.16472V1.1093ZM3.69702 16.7233V11.4488H16.3248V13.814L16.2803 13.8558H13.2068V16.7233H12.3383H3.69702ZM18.6633 11.8884C18.6633 12.1395 18.4406 12.3279 18.1956 12.3279H17.7279V10.1512H2.31621V12.3488H1.84851C1.58126 12.3488 1.38082 12.1395 1.38082 11.9093V5.31628C1.38082 5.06512 1.60353 4.87674 1.84851 4.87674H18.1733C18.4406 4.87674 18.641 5.08605 18.641 5.31628V11.8884H18.6633ZM14.6767 6.94884C14.6767 7.24186 14.4095 7.49302 14.0977 7.49302C13.7859 7.49302 13.5186 7.24186 13.5186 6.94884C13.5186 6.65581 13.7859 6.40465 14.0977 6.40465C14.4095 6.40465 14.6767 6.65581 14.6767 6.94884ZM17.0152 6.94884C17.0152 7.24186 16.748 7.49302 16.4362 7.49302C16.1244 7.49302 15.8571 7.24186 15.8571 6.94884C15.8571 6.65581 16.1244 6.40465 16.4362 6.40465C16.748 6.40465 17.0152 6.65581 17.0152 6.94884Z"/></svg>
const endConversationIcon = <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.35472 18.1979V15.7484C1.04151 15.6834 0 14.6429 0 13.3639V3.28408C0 1.96178 1.10943 0.899601 2.49057 0.899601H12.5208C12.8377 0.899601 13.0868 1.13805 13.0868 1.44153C13.0868 1.74501 12.8377 1.98346 12.5208 1.98346H2.51321C1.76604 1.98346 1.15472 2.56874 1.15472 3.28408V13.3639C1.15472 14.0793 1.76604 14.6646 2.51321 14.6646H2.9434C3.26038 14.6646 3.50943 14.903 3.50943 15.2065V17.526L6.31698 14.838C6.43019 14.7296 6.56604 14.6863 6.72453 14.6863H17.2528C18 14.6863 18.6113 14.101 18.6113 13.3856V7.92299C18.6113 7.61951 18.8604 7.38106 19.1774 7.38106C19.4943 7.38106 19.7434 7.61951 19.7434 7.92299V13.3639C19.7434 14.6863 18.634 15.7484 17.2528 15.7484H6.95094L3.80377 18.7616C3.64528 18.9133 3.41887 19 3.21509 19C3.10189 19 2.98868 18.9783 2.89811 18.935C2.58113 18.8049 2.35472 18.5231 2.35472 18.1979ZM20.7849 0.162578C20.5585 -0.0541928 20.1962 -0.0541928 19.9925 0.162578L17.9094 2.15687L15.8264 0.162578C15.6 -0.0541928 15.2377 -0.0541928 15.034 0.162578C14.8075 0.37935 14.8075 0.726184 15.034 0.921278L17.117 2.91557L15.034 4.90987C14.8075 5.12664 14.8075 5.47347 15.034 5.66857C15.1472 5.77695 15.283 5.82031 15.4415 5.82031C15.6 5.82031 15.7358 5.77695 15.8491 5.66857L17.9321 3.67427L20.0151 5.66857C20.1283 5.77695 20.2642 5.82031 20.4226 5.82031C20.5811 5.82031 20.717 5.77695 20.8302 5.66857C21.0566 5.4518 21.0566 5.10496 20.8302 4.90987L18.7472 2.91557L20.8302 0.921278C21.0113 0.726184 21.0113 0.37935 20.7849 0.162578Z"/></svg>

export {
  paperclip,
  sendButton,
  chatbotButton,
  closeIcon,
  menuButton,
  linkOut,
  printIcon,
  endConversationIcon
}