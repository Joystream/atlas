import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar } from '@/styles'
import { isMobile } from '@/utils/browser'

import { iconMap } from './iconMap'

export let offset = 300
const PANEL_HIGHLIGHT_OFFSET = 60

type Milestone = {
  icon: string
  title: string
  content: string
  generalIndex?: number
}

export type QuartersData = {
  year: string
  id: string
  deliveryMilestones: Milestone[]
}

type QuarterPanelProps = {
  data: { quarters: QuartersData[] }
}

function QuarterPanel({ data }: QuarterPanelProps) {
  const [activeItem, setActiveItem] = useState(0)
  const [activeText, setActiveText] = useState(0)
  const [isNextItemActive, setIsNextItemActive] = useState<boolean>(false)
  const [dotActiveState, setDotActiveState] = useState(false)
  const smMatch = useMediaMatch('sm')
  const [modalData, setModalData] = useState({
    isOpen: false,
    content: '',
    title: '',
  })

  if (isMobile()) {
    offset = 200
  } else {
    offset = 300
  }

  const activeItemsData = useRef<[boolean, boolean, number]>([false, false, 0])
  const activeTextIndex = useRef<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      const timelineItems = document.querySelectorAll<HTMLDivElement>('.QuarterPanel__submain')
      const scroll = window.scrollY
      const MOVING_CIRCLE_HEIGHT = 24
      timelineItems.forEach((item, index) => {
        const itemTop = item.offsetTop
        const itemHight = item.offsetHeight
        if (index === 0 && scroll < itemTop - offset) {
          activeItemsData.current = [false, false, activeItemsData.current[2]]
        } else if (index === timelineItems.length - 1 && scroll > itemTop - offset + itemHight - MOVING_CIRCLE_HEIGHT) {
          activeItemsData.current = [false, false, activeItemsData.current[2]]
        } else if (scroll > itemTop - offset) {
          if (timelineItems.length - 1 > index) {
            if (timelineItems[index + 1].offsetTop - offset - PANEL_HIGHLIGHT_OFFSET < scroll) {
              activeItemsData.current = [true, activeItemsData.current[1], index]
            }

            if (timelineItems[index + 1].offsetTop - offset - PANEL_HIGHLIGHT_OFFSET > scroll) {
              activeItemsData.current = [false, activeItemsData.current[1], index]
            }
          }

          activeItemsData.current = [activeItemsData.current[0], true, index]
        }
      })

      const timelineText = document.querySelectorAll<HTMLDivElement>('.QuarterPanel__main__rigth')
      timelineText.forEach((item, index) => {
        const itemTop = item.offsetTop
        if (scroll > itemTop - offset) {
          activeTextIndex.current = index
        }
      })

      setIsNextItemActive(activeItemsData.current[0])
      setDotActiveState(activeItemsData.current[1])
      setActiveItem(activeItemsData.current[2])
      setActiveText(activeTextIndex.current)

      if (
        scroll > timelineText[activeText].offsetTop + timelineText[activeText].offsetHeight - offset - 200 &&
        activeText < timelineText.length - 2
      ) {
        const opacity =
          scroll - timelineText[activeText].offsetTop - timelineText[activeText].offsetHeight - 200 - offset

        timelineText[activeText].style.opacity = String(-opacity / 100 - 9)
      } else {
        timelineText[activeText].style.opacity = String(1)
      }

      if (activeText === timelineText.length - 1) timelineText[activeText].style.opacity = String(0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeText])

  const numberOfItems = data.quarters.reduce((acc, curr) => {
    return acc + curr.deliveryMilestones.length
  }, 0)

  const isPanelAndRelatedActive = (milestone: Milestone) =>
    (milestone?.generalIndex === activeItem && dotActiveState) ||
    (activeItem === 0 && !dotActiveState && milestone?.generalIndex === 0)

  const isPanelActive = (allMilestones: Milestone[], milestoneIndex: number, currentMilestone: Milestone) =>
    (isPanelAndRelatedActive(currentMilestone) && !isNextItemActive) ||
    (isPanelAndRelatedActive(allMilestones[milestoneIndex - 1]) && isNextItemActive)

  const shouldMilestoneContentBeTruncated = (milestone: Milestone) => milestone.content.length > 100 && isMobile()

  return (
    <Box style={{ width: '100%' }}>
      {data.quarters.map((res, index) => {
        return (
          <div className="QuarterPanel__main" key={index}>
            <div className="QuarterPanel__main__rigth">
              <div
                className={cn('QuarterPanel__main__title', {
                  'QuarterPanel__main__title--active': index === activeText || activeText === data.quarters.length,
                })}
              >
                <div className="QuarterPanel__main__subtitle">{res.year}</div>
                <div className="QuarterPanel__main__quarters">{res.id}</div>
              </div>
            </div>
            <div>
              {res.deliveryMilestones.map((milestone, deliveryMilestoneIndex) => {
                return (
                  <div
                    className="QuarterPanel__submain"
                    key={deliveryMilestoneIndex}
                    id={`panel${milestone.generalIndex}`}
                  >
                    <div className="QuarterPanel__main__timeline">
                      <div className="QuarterPanel__main__line__line" />
                      <div
                        className={cn('QuarterPanel__main__line__dot', {
                          'QuarterPanel__main__line__dot--active':
                            milestone.generalIndex === activeItem && dotActiveState,
                          'QuarterPanel__main__line__dot--hide': (milestone.generalIndex ?? 0) < activeItem,
                          'QuarterPanel__main__line__dot--stick':
                            !dotActiveState && milestone.generalIndex === 0 && activeItem === 0,
                        })}
                      />
                    </div>

                    <div
                      className={cn('QuarterPanel__main__panel', {
                        'QuarterPanel__main__panel--active': isPanelActive(
                          res.deliveryMilestones,
                          deliveryMilestoneIndex,
                          milestone
                        ),
                      })}
                    >
                      <div className="QuarterPanel__main__link">
                        <div
                          className={cn('QuarterPanel__main__playIcon', {
                            'QuarterPanel__main__playIcon--active': isPanelActive(
                              res.deliveryMilestones,
                              deliveryMilestoneIndex,
                              milestone
                            ),
                          })}
                        >
                          <img
                            className={cn('mileston__icon', {
                              'mileston__icon--active': isPanelActive(
                                res.deliveryMilestones,
                                deliveryMilestoneIndex,
                                milestone
                              ),
                            })}
                            src={iconMap[milestone.icon as keyof typeof iconMap]}
                            alt="Mileston icon"
                          />
                        </div>
                        {/*<div className="QuarterPanel__main__linkIcon">*/}
                        {/*  /!*<TooltipPanel text="Copy link to share" activeText="Link copied to the clipboard!">*!/*/}
                        {/*  /!*  <button*!/*/}
                        {/*  /!*    className="QuarterPanel__main__linkIcon__icon linkBtn"*!/*/}
                        {/*  /!*    onClick={() => getLink(milestone.generalIndex)}*!/*/}
                        {/*  /!*  />*!/*/}
                        {/*  /!*</TooltipPanel>*!/*/}
                        {/*</div>*/}
                      </div>
                      <Text margin={{ top: 4 }} variant={smMatch ? 'h600' : 'h400'} as="h2">
                        {milestone.title}
                      </Text>
                      <Text margin={{ top: 2, bottom: 4 }} variant={smMatch ? 't400' : 't200'} as="p" color="colorText">
                        {smMatch ? milestone.content : milestone.content.slice(0, 100) + '...'}
                      </Text>
                      {shouldMilestoneContentBeTruncated(milestone) ? (
                        <Button
                          fullWidth
                          onClick={() => {
                            setModalData({
                              content: milestone.content,
                              title: milestone.title,
                              isOpen: true,
                            })
                          }}
                          variant="secondary"
                        >
                          Read more
                        </Button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="QuarterPanel__main">
        <div className="QuarterPanel__main__rigth" style={{ opacity: 0 }}>
          <div className="QuarterPanel__main__title">
            <div className="QuarterPanel__main__subtitle" />
            <div className="QuarterPanel__main__quarters" />
          </div>
        </div>
        <div className="QuarterPanel__submain">
          <div className="QuarterPanel__main__timeline">
            <div
              className={cn('QuarterPanel__main__line__dot', {
                'QuarterPanel__main__line__dot--hide': numberOfItems !== activeItem,
                'QuarterPanel__main__line__dot--active': numberOfItems === activeItem && dotActiveState,
              })}
            />
            <div className="QuarterPanel__main__line__line" />
            <div
              className={cn('QuarterPanel__main__line__dotbottom', {
                'QuarterPanel__main__line__dotbottom--active': 0 !== activeItem && !dotActiveState,
              })}
            />
          </div>
        </div>
      </div>
      <DialogModal
        show={modalData.isOpen}
        secondaryButton={{
          text: 'Close',
          onClick: () => setModalData({ isOpen: false, title: '', content: '' }),
        }}
      >
        <Text variant="h500" as="h3" margin={{ bottom: 4 }}>
          {modalData.title}
        </Text>
        <Text variant="t300" as="p" color="colorText">
          {modalData.content}
        </Text>
      </DialogModal>
    </Box>
  )
}

export default function cn(def: string, args?: Record<string, boolean>) {
  let classes = `${def}`
  const entries = Object.entries(args ?? {})

  entries.forEach(([key, value]) => {
    if (value) {
      classes += ` ${key}`
    }
  })

  return classes
}

const Box = styled.div`
  margin: 100px 0;

  .QuarterPanel__submain {
    display: grid;
    flex-direction: column;
    gap: 30px;
    grid-gap: 30px;
    grid-template-columns: 76px 712px;

    &__bottom {
      display: grid;
      flex-direction: column;
      gap: 30px;
      grid-gap: 8px;
      grid-template-columns: 76px 712px;
    }

    @media (max-width: 1200px) {
      grid-template-columns: 76px 550px;

      &__bottom {
        grid-template-columns: 76px 550px;
      }
    }

    @media (max-width: 992px) {
      grid-gap: 30px;
      grid-template-columns: 40px 540px;

      &__bottom {
        width: 475px;
        grid-template-columns: 40px 540px;
      }
    }

    @media (max-width: 768px) {
      width: 432px;
      gap: 0;
      grid-template-columns: 40px auto;

      &__bottom {
        width: 432px;
        grid-template-columns: 40px auto;
      }
    }

    @media (max-width: 768px) {
      width: auto;

      &__bottom {
        width: auto;
      }
    }
  }

  .QuarterPanel__main {
    display: grid;
    flex-direction: column;
    width: 1030px;
    gap: 30px;
    grid-gap: 30px;
    grid-template-columns: 182px 818px;

    &__rigth {
      position: relative;
      display: flex;
      align-items: end;
      flex-direction: column;
      width: 182px;
      margin-bottom: -100px;
      text-align: right;
    }

    &__title {
      position: sticky;
      top: 300px;
      align-items: end;
      flex-direction: column;
      text-align: right;
      opacity: 0.4;
      transition: opacity 0.3s ease-in-out;

      &--active {
        opacity: 1;
      }

      &--last {
        margin-bottom: 0;
      }
    }

    &__subtitle {
      position: relative;
      width: 160px;
      height: 48px;
      font-size: 40px;
      text-align: right;
    }

    &__quarters {
      position: relative;
      font-size: 32px;
      color: ${cVar('colorText')};
    }

    &__timeline {
      position: relative;
      display: flex;
      align-items: center;
      flex-direction: column;

      &__bottom {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
    }

    &__line {
      &__dotbottom {
        position: absolute;
        bottom: 0;
        width: 24px;
        height: 24px;
        min-height: 24px;
        background-color: silver;
        border-radius: 50%;

        &--active {
          background-color: ${cVar('colorBackgroundPrimary')};
        }
      }

      &__dot {
        width: 24px;
        height: 24px;
        background-color: ${cVar('colorBackground')};
        border-radius: 50%;

        &__loading {
          width: 24px;
          height: 24px;
          background: ${cVar('colorBackgroundPrimary')};
          border-radius: 50%;
        }

        &--active {
          position: fixed;
          top: 300px;
          z-index: 2;
          width: 24px !important;
          background: ${cVar('colorBackgroundPrimary')};
        }

        &--hide {
          opacity: 0;
        }

        &--stick {
          position: absolute;
          top: 0;
          background: ${cVar('colorBackgroundPrimary')};
        }

        &--last {
          width: 4px;
        }
      }

      &__line {
        position: absolute;
        right: 0;
        left: 0;
        width: 4px;
        height: 100%;
        margin: 0 auto;
        background-color: ${cVar('colorBackground')};

        &__bottom {
          top: 1px;
          left: 10px;
          width: 4px;
          height: 100%;
          margin-top: -28px;
          background-color: purple;
        }
      }
    }

    &__panel__loading {
      width: 500px;
      height: 324px;
      padding: 24px;
      background: ${cVar('colorBackground')};
      border-radius: 4px;
      gap: 16px;
    }

    &__panel {
      width: 712px;
      margin-bottom: 48px;
      padding: 24px;
      background: ${cVar('colorBackgroundMutedAlpha')};
      border-radius: 4px;
      opacity: 0.4;

      &--active {
        opacity: 1;
      }

      &--laster {
        margin-bottom: 0;
      }

      &__bottom {
        width: 500px;
        padding: 24px;
        background: red;
        border-radius: 4px;
      }
    }

    &__underline {
      position: relative;
      display: inline-block;
      text-decoration: underline;
      cursor: pointer;
    }

    &__link {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: repeat(2, 1fr);
    }

    &__playIcon {
      display: inherit;
      align-items: center;
      width: 48px;
      height: 48px;
      background-color: #dee3e9;
      border: solid 1px #a3c3f230;
      border-radius: 50%;
      justify-items: center;

      &--active {
        background-color: #4038ff26;
      }
    }
    @media (max-width: 1200px) {
      width: 818px;
      grid-template-columns: 132px 656px;

      &__rigth {
        width: 132px;
      }

      &__panel {
        width: 550px;
      }
    }

    @media (max-width: 992px) {
      width: 700px;
      grid-gap: 20px;
      grid-template-columns: 70px 610px;

      &__subtitle {
        //styleName: h5;
        font-size: 28px;
        font-weight: 400;
        line-height: 36px;
        letter-spacing: 0;
      }

      &__quarters {
        //styleName: h6;
        font-size: 24px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0;
      }

      &__panel {
        width: 540px;
        padding: 16px;
        gap: 1px;

        &__bottom {
          width: 540px;
          padding: 16px;
        }
      }

      &__timeline {
        width: 40px;
      }

      &__rigth {
        width: auto;
      }

      &__line {
        &__dotbottom {
          height: 24px;
          min-height: 24px;
        }
      }
    }

    @media (max-width: 768px) {
      width: 500px;
      grid-gap: 0;
      grid-template-columns: 68px 432px;

      &__subtitle {
        font-size: 28px;
        font-weight: 400;
        line-height: 36px;
        letter-spacing: 0;
      }

      &__quarters {
        font-size: 24px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0;
      }

      &__panel {
        width: 392px;
        padding: 16px;
        gap: 1px;

        &__bottom {
          width: 392px;
          padding: 16px;
        }
      }

      &__title {
        top: 300px;
      }

      &__timeline {
        width: 40px;
      }

      &__rigth {
        width: auto;
      }

      &__line {
        &__dotbottom {
          height: 24px;
          min-height: 24px;
        }

        &__dot {
          &--active {
            top: 200px;
          }
        }
      }
    }

    @media (max-width: 768px) {
      width: 100%;
      grid-template-columns: 68px 1fr;

      &__panel {
        width: auto;
      }
    }

    @media (max-width: 550px) {
      &__panel {
        &__content {
          margin-top: 4px;
        }
      }
    }
  }

  .mileston__icon {
    width: 24px;
    height: 24px;

    &--active {
      /* filter configuration comes from CSS filter generator - check NOTE below */
      filter: invert(12%) sepia(63%) saturate(6234%) hue-rotate(222deg) brightness(87%) contrast(156%);
    }
  }
`

type QuartersListDataProps = {
  data: { quarters: QuartersData[] }[]
}

export function QuartersListData({ data }: QuartersListDataProps) {
  return (
    <QuartersListContainer>
      {data.map((res, index) => {
        return <QuarterPanel data={res} key={index} />
      })}
    </QuartersListContainer>
  )
}

const QuartersListContainer = styled.div`
  display: grid;
  justify-content: center;
`
