import styled from '@emotion/styled'
import { FC } from 'react'

type NoActorNotificationAvatarProps = {
  size: 'regular' | 'small'
}

export const NoActorNotificationAvatar: FC<NoActorNotificationAvatarProps> = ({ size }) => {
  return (
    <div>
      {/* this wrapper div is used so that the ListItem doesn't override the SVG's fill */}
      <StyledSvg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
        <path fill="#52616B" d="M0 0h256v256H0z" />
        <g clipPath="url(#a)" fill="#F4F6F8">
          <path d="m143.921 48.08 14.632.035-.184 68.379a65.268 65.268 0 0 1-16.629 43.387 76.873 76.873 0 0 0 1.986-17.19l.195-94.61ZM96.87 167.33a39.213 39.213 0 0 1-29.952 14.462l4.407-14.531 25.545.069ZM105.821 141.156v1.455a38.906 38.906 0 0 1-2.295 13.087l-28.69-.08 4.384-14.543 26.601.081ZM170.212 48.149h14.574l-.115 42.252a65.266 65.266 0 0 1-16.651 43.386 76.805 76.805 0 0 0 1.985-17.189l.207-68.449Z" />
          <path d="m132.307 48-.252 94.645a65.517 65.517 0 0 1-19.355 46.244 65.704 65.704 0 0 1-46.413 19.077H59l4.395-14.543h2.927a51.109 51.109 0 0 0 36.122-14.818 50.969 50.969 0 0 0 15.083-35.971L117.722 48h14.585Z" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" transform="translate(59 48)" d="M0 0h125.786v160H0z" />
          </clipPath>
        </defs>
      </StyledSvg>
    </div>
  )
}

const StyledSvg = styled.svg<NoActorNotificationAvatarProps>`
  border-radius: 9999px;
  width: ${({ size }) => (size === 'regular' ? '40px' : '32px')};
  height: ${({ size }) => (size === 'regular' ? '40px' : '32px')};
`
