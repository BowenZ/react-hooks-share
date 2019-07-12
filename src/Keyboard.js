import React from 'react'

function Key(props) {
  return (
    <div
      className={`key key--${props.color} ${props.active ? 'active' : ''}`}
      onClick={index => {
        props.onClick(index)
      }}
    />
  )
}

export default function Keyboard(props) {
  return (
    <div className="keys">
      {new Array(10).fill(null).map((item, index) => {
        const skip = [2, 6, 9, 13].includes(index)
        return (
          <React.Fragment key={index}>
            <Key
              active={props.activeIndex === index}
              color="white"
              onClick={() => {
                props.onClick(index)
              }}
            />
            {!skip ? (
              <Key
                active={props.activeIndex === index}
                color="black"
                onClick={() => {
                  props.onClick(index)
                }}
              />
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}
