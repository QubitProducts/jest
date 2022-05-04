const React = require('preact')
const { onEvent, replace, restoreAll } = require('@qubit/utils/dom')()

module.exports = function renderPlacement ({
  content,
  onImpression,
  onClickthrough,
  onRemove,
  elements: [$hero]
}) {
  onRemove(restoreAll)
  onImpression()

  onEvent($hero.querySelector('a'), 'click', onClickthrough)

  if (!content) return

  const { message, image, link } = content
  const hero = document.createElement('div')
  React.render(
    <div className='hero' style={{ backgroundImage: `url(${image})` }}>
      <div className='hero__inner'>
        <div className='page-width text-center'>
          <h2 className='h1 mega-title mega-title--large'>{message}</h2>
          <a href={link} className='btn hero__btn' onClick={onClickthrough}>
            Click here
          </a>
        </div>
      </div>
    </div>,
    hero
  )

  replace($hero, hero)
}
