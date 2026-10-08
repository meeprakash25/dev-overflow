import UserAvatar from '../UserAvatar'
import Link from 'next/link'
import ROUTES from '@/constants/routes'
import { Avatar } from '../ui/avatar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { AvatarFallback } from '@base-ui/react'

const UserCard = ({_id, name, image, username}:User) => {
  return (
    <div className="shadow-light100_darknone w-full xs:w-[230px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <UserAvatar
          id={ _id }
          name={ name }
          imageUrl={ image }
          className="size-[100px] rounded-full object-cover"
          fallbackClassName='text-3xl tracking-widest'
        />
        <Link href={ ROUTES.PROFILE(_id) } >
          <div className="mt-4 text-center">
            <h3 className='h3-bold text-dark200_light900 line-clamp-1'>{ name }</h3>
            <p className='body-regular text-dark500_light500 mt-2'>@{username}</p>
          </div>
          {/* <Avatar className={ cn("relative", className) }
            {imageUrl ? (
            <Image
              src={ imageUrl }
              alt={ name }
              className='object-cover'
              fill
              quality={ 100 }
            />
          ) : (
              <AvatarFallback
                className={ cn("primary-gradient font-space-grotest font-bold tracking-wider text-white", fallbackClassName) }
              >
                { initials }
              </AvatarFallback>
            )}
          >
          </Avatar> */}
        </Link>
      </article>
    </div>
  )
}

export default UserCard