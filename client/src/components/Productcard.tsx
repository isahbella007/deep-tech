import { useState } from "react";
import { addToCart } from "../api/cart";
import { IProduct } from "../pages/ProductListing";
import { Plus, Minus } from 'lucide-react';

interface Props {
    product: IProduct;
    onCartUpdate(): void
  }

const ProductCard = ({product, onCartUpdate}: Props) => { 
  const [quantity, setQuantity] = useState(1)
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = async () => {
    try {
      if(product._id){ 
        await addToCart(product._id, quantity);
        onCartUpdate();
        setQuantity(1);
      }
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };
  
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden" key={product._id}>
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEhAQEBAQEBUXEBAQEBUQDxAPDxAQFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtMC0BCgoKDg0OGxAQGi0lHSItLS0tLzctKy8tLS0tLSstLS0tLS0tLS0tLy0tLS0tLS0tLy0tLSstLS0tLS0tNy0tK//AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xABNEAACAQIDAwcHCAYIBAcAAAABAgADEQQSIQUxUQYTIkFhcZEHIzKBobHBFEJScnOy0fAkM3SCksIVU2KTlKLS4RY0VYMlNUNFY2Tx/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAIDAQQFBv/EADIRAAIBAwEFBQgBBQAAAAAAAAABAgMEETEFEiEiQUJRYXGhEyMyM1KBwdGRFBUk4fD/2gAMAwEAAhEDEQA/APVoQhJlQRbxIQBbxbxsIA68LxsIA68LxsIA68LxsIAt4kIQAhCEGAhCEAIQlSti7ejb1yMpKOpOMHJ8C3CZw2gw3hT4iTUtoKd+ntEwqkX1MulJdC3CMWsp3MPGPk8kMBCEBBgISRaDHqPr0kq4Q9ZA7tYyZwytCXPkY4nwhMZM7rKcIQmSIQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEISnicSNQDp1nj2CYlJRWWTjFyeELi8QNw3dfb2TLfEi9ryHH4ywPV1eOk5jamPdGzIQbAEqTroQSBNCpVbZ06NDCwdYtYHcYVEnKrtb5w3WuO6aOzdsCoNDfW3rlakSlSaNXORHJiWG4keu0YKgO+MvJZa0ZVhdTRpbSca6HvAM6mhUDKrLuIDDuIvOJVp0+xat6SjgWX23HsImxSm28MoqwSWUaULyPNELS4pJLxZDmhAKEIQlhSEIQgBCEIAQhCAEIQgBCEIAQhCAEITN2ltALdQe8yMpKKyycIObwg2njLdFT9Yj3CY9bGj/aVcRiWchVBYncq7z/ALdsrDk8764iuVW+lOiQDbg1Q+4Ad80ZTdR8DqU6Uaa4mLyl2o7q1LD9KppcjcguDqeOk4rbvKSuq8zVTIbbwd/bunrOG2VhqIy00AG8ks7MTxLE3MemDw6PzgpUg9rZyqmoBwDHWRSS1LXV4cpwXI3ZeKxNEJVSpRXN+sqJlJp7+gDYtcaX3TuMFsajhlyoCdbksbkmWKuOA3GVKmMvu1mG0RblLUlL8IqXkAxAEacVIZMbrL61Jv8AJ6r0Kg/t5vFQP5Zxvyntm3yTxmY1xw5v3NLaMuYprQ5TrOeiipKJeMNUibeTTwaWeEzvlMIyZ3WTwhCXGuEIQgBCEIAQhCAEIQgBCEIAQhCABJ6hf1XlPE4JSCz0VIAuegPhGYTaH6QaZ61YetbH3ZpLyox70aBakUzZ0BDmiPN3HOFRVqU1JC8WE4VzD2lV4kzeinTSTMXG1aNBnFOko1yknUsAfzpMTG7TNwdw3aCw7PjOiweyhiKNOuXBZ11NqdvSIB6FR13AbmbdIsXybW1s9/4JCdzKnyqPBeRvRqUnHxOUbaDdV5SxW11QZmY77dG7m/DTunVUOSgY9IaDWVNs8lGqZFoqllJLZmy62sLad8xRrzqyUd3UOpTj1OUG31c2VKx7ci2+9LmGxRYhQr3O4ED4Ezp9m8jKaa1nLG1stPoqPXvPsmvhdhYakbrSBPFyX9h0nSjbSepXK9pJYWTn15O4k2NlPbnS1uzWSpycxG7oL2lx8Lzrs8aak2FbQNF3lR9xiYTkug1q1Gc8F6Kjx3y1gsBTwpYU8xz2JzEE3GnUBL5qSCqoJvfqtJunFLgiCrSb5mTrXBilxKhTthrIbsiSlHvLOkJWzGJGH3GcrvNiEIS81QhCEAIQmBjeW2zqLGnUx1BWBswDlyp4HKDYwZN+E51OXezDux+H/iIt4iX8ByiweIOWhjMNVbqVK9NnP7t7wDThCc/y25VJsugtZ6bVS1QUqaKQt2ylrljuFlMA6CE8Yq+Wqv8ANwVFe+rUf3ASqfLXi+rCYXxrf6pjKM7rPcYTxSj5asT87B4c/VqVV995t7H8sKVKiUsRg2pZnCZqVYVQCTYEqVU2vwvGUMM9PUAbgB3C0ocq8RUp4ZmpVqdBwy5Xq3NMb751CNmW17iw0BNxa8vzI5aBjhGVKSVmLoFR1FTM19AqFlzE7rX3E6HcederE4stpcSzsjGkYGnUzmo2RrscxJfOVa4amhBBuCuRbEWtpMJ2JJJNyd5OpM6LY1I/J1WrSFK/O3S2WytUcqWFzZypDNqekTKVXYb36BGXqzaN4f8A5ODfU51JJx4o6lnVhBNS4Mn2Ni2ZGRiTlIsTqbG+nsjmbU98fh8OKS5Qbm92JFjfu6pDadLZUZb/ADdF+TTvJRbbjo2KXiZ5S2htOjhxevWp0hv6bBdOMz6PK7AOwRMZRdjoFRizE9gA1neyaODcLRpaZA5U4HMU+W4YMDYq1ZEYHgQxFjNZbEAgggi4INwRxBgCFo3NH5YmWAMzRC0cViZYA3NFhlhBg2oQhACEIQBGawJ4AmfImPa7O3F2PiSZ9bYxrU6h4U3P+Uz5Erm+siyUSTBfO7pe5M/8zhv2qj94Shgz6X1Ze5Mn9Iw37VR+8JF6Ez6xM8v8vLfo2DH/ANlj4Um/GeoGeU+XtvNYAf8Ay128EUfGTehWtTxirIhJKkjEgWkw6pYZyrEjQg3HYRrK/CS4j53cYMH1qu4dwmbynpB8MwIv06TC1HFYgghwQRTw7LUJB10Om87poUDdUPFVPske0sCa9LIr82welURinOKHpurrmS4zLdRcXHfNS/0i/EzR1K3JzP8AJaPOIUa7AgpVQ5ecbKctVmdbrlNmJIvrbcNdjKOzMB8nopSzl8rMxOXKOk5chVHoqMxAXWwAEuOdJyHLizYwU6x1PcPjI1TQdwhiG9LuA9ev+0nVdJu7K4ub8vyV3GiPFfLgfPUBwp39rTy/CfrE+up9onpflzb9KpjhSH59s80wQ84v1h751SlaFuq12qd/wM+iOQS32dgP2al7p86N6T9/wM+kPJ4L7MwH7MnxkkYlobOSJzcs5YmWSIFbm4nNy1lhkgFXm4ktZIQCeEIQAhCEApbbfLh8S261Csf8hnyZWG7XqE+usdhVrU6lJrhXRqbZTZsrCxt26zhG8jmzfpYv+/X/AETDRZBHgWFXRu6XuTQ/SMN+00fvrPbF8jWz9bVMYL8KtI++nKS+SjCYd6dSliMVdKi1BnaiwJUg2NkHCRaJYPUjPIvL6+uz17MWfDmB8TPXJ455en87gV4UsQ3i1MfyyT0K46nktSRiSVJGJAmSnqk9bee6QHqk9Xee6AfV2zzelS+yp/dEkxNc06bOqhiCtgzhAbsAekdAddO20h2WfM0PsaX3BJsVSz02Wym9tHvlOoOs1b9e7XmKXxFRcdiAVD0qQBYByK6nIvQuTe1/SbQcBvlqvVQAnMALEnp2AA3nfKC7GGh5ugNCLqLmx36ldeqVn2aUH6vDj0r5b31FtLLecWW6zbRcq1AR0SCNNxB3zQmFgMOtMIiqi3cFub9EsSLn88Juzp7KWIyx3lFxqjwfy2vfGgcKagfwr+M88wQ84t/pD3z6g2ryWwWKqGriMLTrPa2Z8xNt3G3VKTchNmDdgaA4WUj4zqKDKd4+c3XpPbdm69/X+M+jvJqb7LwH2FvBmEgbkDszX9CpdtmqA+xp0GxcDTw9GnRorkpoCEW7NlFybXJJ65ndwYbyXLQtFhBES0LRYQBtoR0IAQhCAEIQgBM6tsKizFmzG5uV6OUnnOcuRbfeaMya71L2U1DckALWpfzC4gthoRJyYoqtg9YAUxT0db2FTnB83U5urcRoQbxr4RabVGUsSxQtmt1XtbTt9kvbSqPSw1Rlu7qtwTa4N9TpbcNfVOV5K7QrV1rc8zOFqIEZt+t8y+ron96SjDMXIuUG4uXcdzPn7ywbQeptKvTZiUpLRSmullzUkqNbtJc+yfQM+cvKqf8AxTHfWo+HMUh8JBmtHU49mjcx4waNkCwfeWlOXKQBu6wGB9RlQGWSdF7j8YB9O8jMS1XA4R3N2NFLmwF7abh3TVxa3puAQNBqzZQNR19UxOQX/l+D+yHvM3WrKujlRfqYjXx3yi++S/sYpfEZ2Go4hCpsrDUWNRrEG267kDd+byXHlrDTKejezDTiL9cu/KaYAAZQALAAgACUcXi0+kviJ5+UzcSZUwzXqJ9YHq6h2TamDgMQr11CsCQGJsQTa2/2ib07WzF7pvx/RrXHxGLyoxtSjTVqRIPOAOV+T5xTyMSVFeoibwt7ncTLi1rrTu1iUViTkvuHAlbm/VcTL5bV6lOhmo1KNN+cAvWIylSrZwBzdS7WuQMu8DeAValypxzLRw9NG0endmVr5lCrYBgBcG972F9O6delHekkas5bscnQF1AuHvxGfNcesy3h/RHr98802PXanWpsul3VSB85WIBB8Z6Xh/RElXp7jwRpz3kSQhCa5YEIQgBCEIAQhCYyjOGEIQvGUMMJT58r/wCjvJBKqw69Pm6y5Ds19ZJmclsFwGIxI6S5dbaNe4teZ2KphSFUBRdTZQALluAmrluPd2TNxaEMtzcl06rDfGSZozM2hsvD4g+fw9GtY6c7SWpa3eJpysd57zMZTNaSaMr/AIX2f/0/B/4an+EaeSuzz/7fg/8AD0/wlatSb5cjnnipBVdccKSZaZvcL5ggk6F9b7jcC23UO7fbrIB0Hq3QQfAzv+E9n/8AT8H/AIal+EY3JTZ41GAwg4Ww9MW9k0ExVFjZWW/VlHS9UmJuL9ndBFST0Y/ZyhUyqoVVOVQBYATz3y2L5vBn+1iPdTnoGCcAG5A6R3m3CcF5aEzUMM6m4WpUVrWIBYLlvw9EzEmsF9NN4PHKjSviAp6h4SwpQ6MxHtEgxhpgdFiT22AlaZdg7zyGUx8uqGw0w1Tq4sk92niXkIwrnE16oDZBQZS1uiWLJYX46MfVPbZatCmWpzXLXMaVILSFZjiqdlys7gKHYsiq6ksADuOmptpcWcfs1a1GlTdebYIuUJYikwUAqOKjd4ddpX5ZUWeiMilmWtmW1HFVjfJUGnMVEZd9s17a7tZrYe9lzCx5qncb8p1uN54cTul0W08ojJZWGYGzeTXMutSo4exBUKLDN1E37beudVQ9Fe6V63onulih6K90VJufFkYxUeCHwhCVEghCEAIQhAOKGOqfS9gj12lUHzvYJThPF+0murPcOnB9EXxter9KPG2qnXY/xfjM2Emq9VdpkXb0n2Uao2y30R6rg+MVdssPp/3jfGZN4SSu6y0kyP8AS0fpRt09ukdTfxg/CNfbAYglWNjcdLhrMaAPuPuMmr6v9RCVlQ+k6LaO1TT3e1jLuFqZlVuKhvEXnkG36mp9c9X2L+oofY0vuiduxrOrls4W0rRUFHjnJgVqtM7VQZqhYDLkspoo5oFlqWz3DMgdc+U6IyzW5RVCKYA3FwG7rE29kzaNdm2nVQYmlZcl6LV/PFRQvlSha2W9TOal79HLawnRYmkrrkYZr9W7136rcZ0EcWvBzg4rqjjwf9p2NNiUQneUUnvI1mfT2GinMSXA1ymwv+PdNSodJmTyalnQnSzvdSqmKppcOyg3vq1jbujauOw7AhjTYdYJuDMPbJ85+6PeZnkzz9zdyjVlFdGezs7CE6MZNvijeqU9nn0qOFPfSU/CVXwGyr3OEwV+o/JluP8ALMgxjGa7vqhtLZtPvZ039J4VFshVQBYBVqAAdgExcbyrRDZKrD++mbXOhnNbQOsnTupyZP8At9LvZ6ecIMfhaJNS1wXzGmlQEPTqU2BWoCNVqMPyQdgU8gUC7AIqG/Say7iePXeZvJL/AJTDfYp7prtPT0/hXkeVrrFSSXeyJ3BFhrx0NgOuWqPor3CQPuk9H0V7hMyKh8IQkAEIQgBCEIBwqUWO4X9Y69Icy30Tx3dVr/ERq1GGgYj1nvims1rEkjdrrp+RPGcvie5589BuU3Isbi9xbUW3wKngfCKKh1133vfUa75JUxTMCCQb9luu/V2zGIjmIIQiSBMWF/cfcYkD8G9xmQzheUtTU+uex7F/UUPsaf3RPF+VB1PrntOxx5ij9lT+6J6HZa5Dh7d0h9/wZSs5x56ahBmUj5RUYuwoocopGkFUjOG0qHS+m+2984fVb3rKw2ZSFY4gJ5wjU53y3sFzZL5Q1gBmtewteWWBuCNd4I7Dbd4TqHnWTCQfNHcPdH85wBv2qwHrvGuLC3ZaYMHL7ZBNUAAnoiwGpOplJ6TCwKsL7rqQT3cZobTxLJWVltdRcXF99wZUxW0KlQqWI6JuthbXT8J5m73fbTzrk9jY7/sKaSWMFfm2+iezQ9v4HwjOaY6BT+Rf3Ax5xDaHNu0G7Tf+J8ZGa7fSPHTja1/Caj3Td5/AhxKkDXTQH1EXE5jHnWdLiGJGpvpbwnMY86y6hqTeh6dsbFtSwWDZVRr0qYYPUFLo5d4Y6DW2/wDCWqW16riy4dGaxOVcXQaw01Nuq5tpfcZDsGkGweEDFB5mkRnRXF8nUG65oUdnCncoKKE31TDqh137jr1eE9dT+BeR4i4+ZLzY+hXqNmz0TSFgQTUR8x1uLLut8Zo0fRXuEpKrAHMwbhZctvaby7S3L3D3TMigdCEJEBCEIAQhCAcDCEJ4o94ESESYAQhEgCxD8G9xhEPwb3GAcBypOp9c9t2V+po/ZU/uieI8qjqfXPb9m/qqX2ae4T0WzPlnC272Pv8AgzcXtBlqOvPog+aHoOx35QQV0IuCPVGUdqMxpquJw7MbKQEqZWNyd1rjosmt7X75ffEIGYMzr++9vDqlkYf+3U/inSZ58joDEXXOaFvn5FqBtx9G5423yxVjWBQekx3XuQTw0jS3eRbr3g6fjAZy+2z50/VHxmeTL22j509wlAzyl4/fz8z2liv8eHkhpMjMcxkZaaxuJDcQejOXx7azpcU3RnJbQqjNNq31EtD1LYeepgsLzYYlVUNlNjYKR9NOzr9U2tl0qguanOA6DptdT3DnHsdOPXMHkRXIoUQFuCqX1Aygga6751xnrKTzBeR4i6WKsvNkDPf86y5T3DuEqMthJ0qiw7hJSKCaEi56Jz0iCaEh52HOQYJoSDnIQDnTybI9HFVD9pTpN90LIG5PVxur0WHA4eop8RUPunWZYmWazsqD7CNxX9wtJs459jYoblw7f96oh8ObPvkbbPxQ34ct9nWpH7xWdrliZZU9m277Pqy2O1Lldr0Rwpo1x6WFxC9ypU+4xkTVSPSp11+thsQB4lZ3+WJaVPZNF6N/99i6O2a61S9f2eeNj6Q31EX6zBD4GSJWVhdWVtG9Fgeo8J3xWVquzqL6tRpMeLUkY+0Sp7Ij0l6Fq21LrD1/0eDcrcQoYgsL69Ynu+zmBpUiCP1aEd2USGpsHDNocLhz/wBmn+EsJstAAqF6YAACoRlAG4AEGw7pv29v7GO6nk0b29d002sYGHCKWYsqm99RmDa8dZPRphQFUWGvWTvN+uM/o4/11T15D/LFGAb+ub+BZeaGCSqlxx7N15C4t8BcmPOAb+uf1KkjbZV99ar6ubH8sYM4Zy+1sPWeqxRaZWw1aoym/XoFPvlX+jK5+dRX+N/wnaDZyjS7esgmL8gXifZNWVhQlJylHi/Fm9DaNxCKjGWEvBfo4xNi1PnVqf7tBvjUkn9B8azfuog9951/yBeLeyHyFeJklY267CMPaNy+2zkG5PoRZqtY+ukPckzsVyLoNuZ79rn4WnfHArxMT5AvEy2NvSjpFfwVu8rvWb/lmFsTBNQVUC3CgKLMp0At84gzoqdbTVT4p/qiJhAOsx/Mdplq4LCKZTcnlkdWpfcp8U/1RVU9niI/mO0xeZ7ZnJEaFP5Ijgh/Ji80fpQ5s/SmDAtj2eJi69ntjebP0onNn6UAfr2QjObP0vfCAWIQi2gDYRbQtAEhFiWgCRIpiQAvHAxkcpgDosSEAW8SEDAGkwhCAEIloWgCxLRIQBbRYgiwAhCEAIQhACEIQAhCEAkhEhAAwiQgBCEIAhjIsIAkBFhAHiLEhACBhCANhFhAEhFhAEiQhACKYsIAkIQgBCLCAJCLCALCEIB//9k=" alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <div className="flex items-center mb-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 text-gray-600 px-2 py-1 rounded-l"
              >
                <Minus size={16} />
              </button>
              <span className="bg-gray-100 px-4 py-1">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 text-gray-600 px-2 py-1 rounded-r"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      );
}
export default ProductCard