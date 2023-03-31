import { SvgActionPlay } from '@/assets/icons'
import { WelcomeView } from '@/components/WelcomeView'

export const CrtWelcomeView = () => {
  return (
    <WelcomeView
      headTagTitle="Creator tokens"
      title="Ready to create your channel token?"
      pageTitle="Creator tokens"
      subtitle="Create your very own channel token, sell it on your own terms and share your success with your token holders."
      type="crt"
      buttons={[
        { children: 'Create token', size: 'large' },
        {
          children: 'Learn more',
          size: 'large',
          variant: 'tertiary',
          to: '',
          _textOnly: true,
          icon: <SvgActionPlay />,
        },
      ]}
    />
  )
}
