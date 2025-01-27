// @flow
import {all, call, fork, takeEvery, put} from 'redux-saga/effects'

import * as layoutConstants from '../../constants'
import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_TYPE,
  TOGGLE_RIGHT_SIDEBAR,
  SHOW_RIGHT_SIDEBAR,
  HIDE_RIGHT_SIDEBAR,
  SHOW_FEEDBACK,
  // HIDE_FEEDBACK,
} from './constants'
import {
  changeSidebarTheme as changeLeftSidebarThemeAction,
  changeSidebarType as changeSidebarTypeAction,
  showFeedback as showNotification,
  showFeedbackSuccess,
  // showFeedbackError
} from './actions'

/**
 * Changes the body attribute
 */
function changeBodyAttribute(attribute, value) {
  if (document.body) document.body.setAttribute(attribute, value)
  return true
}

/**
 * Toggle the class on body
 * @param {*} cssClass
 */
function manageBodyClass(cssClass, action = 'toggle') {
  switch (action) {
    case 'add':
      if (document.body) document.body.classList.add(cssClass)
      break
    case 'remove':
      if (document.body) document.body.classList.remove(cssClass)
      break
    default:
      if (document.body) document.body.classList.toggle(cssClass)
      break
  }

  return true
}

/**
 * ---------------------------------------------------------------------------------------------------------------------------
 * Note: Following are the functions which allows you to save the user preferences on backend side by making an api request.
 * For now, we are just applying the required logic on frontend side
 * ----------------------------------------------------------------------------------------------------------------------------
 */

/**
 * Changes the layout type
 * @param {object} setting User's preferred setting
 */
function* changeLayout({payload: layout}) {
  try {
    yield call(changeBodyAttribute, 'data-layout', layout)
    if (layout === layoutConstants.LAYOUT_VERTICAL) {
      yield put(
        changeLeftSidebarThemeAction(
          layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT,
        ),
      )
      yield put(
        changeSidebarTypeAction(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED),
      )
    }

    if (layout === layoutConstants.LAYOUT_HORIZONTAL) {
      yield put(
        changeLeftSidebarThemeAction(
          layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT,
        ),
      )
      yield put(
        changeSidebarTypeAction(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED),
      )
    }
  } catch (error) {}
}

/**
 * Changes the layout width
 * @param {object} setting User's preferred setting
 */
function* changeLayoutWidth({payload: width}) {
  try {
    if (width === layoutConstants.LAYOUT_WIDTH_BOXED) {
      yield call(manageBodyClass, 'left-side-menu-condensed', 'add')
      yield call(manageBodyClass, 'boxed-layout', 'add')
    } else {
      yield call(manageBodyClass, 'left-side-menu-condensed', 'remove')
      yield call(manageBodyClass, 'boxed-layout', 'remove')
    }
  } catch (error) {}
}

/**
 * Changes the left sidebar theme
 * @param {object} setting User's preferred setting
 */
function* changeLeftSidebarTheme({payload: theme}) {
  try {
    if (theme === layoutConstants.LEFT_SIDEBAR_THEME_DARK) {
      yield call(manageBodyClass, 'left-side-menu-dark', 'add')
    } else {
      yield call(manageBodyClass, 'left-side-menu-dark', 'remove')
    }
  } catch (error) {}
}

/**
 * Changes the left sidebar type
 * @param {object} setting User's preferred setting
 */
function* changeLeftSidebarType({payload: type}) {
  try {
    switch (type) {
      case layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED:
        yield call(manageBodyClass, 'left-side-menu-condensed', 'add')
        break
      case layoutConstants.LEFT_SIDEBAR_TYPE_SCROLLABLE:
        yield call(manageBodyClass, 'left-side-menu-condensed', 'remove')
        yield call(manageBodyClass, 'scrollable-layout', 'add')
        break
      default:
        yield call(manageBodyClass, 'left-side-menu-condensed', 'remove')
        yield call(manageBodyClass, 'scrollable-layout', 'remove')
        break
    }
  } catch (error) {}
}

/**
 * Toggles the rightsidebar
 */
function* toggleRightSidebar() {
  try {
    yield call(manageBodyClass, 'right-bar-enabled')
  } catch (error) {}
}

/**
 * Show the rightsidebar
 */
function* showRightSidebar() {
  try {
    yield call(manageBodyClass, 'right-bar-enabled', 'add')
  } catch (error) {}
}

/**
 * Hides the rightsidebar
 */
function* hideRightSidebar() {
  try {
    yield call(manageBodyClass, 'right-bar-enabled', 'remove')
  } catch (error) {}
}

/**
 * Shows the toastr
 */
function* showFeedback({payload}) {
  try {
    yield put(showFeedbackSuccess(payload))
  } catch (error) {
    yield put(showFeedbackSuccess(error))
  }
}

/**
 * Hides the toastr
 */
// function* hideFeedback() {
//   try {
//     yield call(showFeedback, 'right-bar-enabled', 'remove')
//   } catch (error) {}
// }

/**
 * Watchers
 */
export function* watchChangeLayoutType() {
  yield takeEvery(CHANGE_LAYOUT, changeLayout)
}

export function* watchChangeLayoutWidth() {
  yield takeEvery(CHANGE_LAYOUT_WIDTH, changeLayoutWidth)
}

export function* watchChangeLeftSidebarTheme() {
  yield takeEvery(CHANGE_SIDEBAR_THEME, changeLeftSidebarTheme)
}

export function* watchChangeLeftSidebarType() {
  yield takeEvery(CHANGE_SIDEBAR_TYPE, changeLeftSidebarType)
}

export function* watchToggleRightSidebar() {
  yield takeEvery(TOGGLE_RIGHT_SIDEBAR, toggleRightSidebar)
}

export function* watchShowRightSidebar() {
  yield takeEvery(SHOW_RIGHT_SIDEBAR, showRightSidebar)
}

export function* watchHideRightSidebar() {
  yield takeEvery(HIDE_RIGHT_SIDEBAR, hideRightSidebar)
}

export function* watchShowFeedback() {
  yield takeEvery(SHOW_FEEDBACK, showFeedback)
}

function* LayoutSaga() {
  yield all([
    fork(watchChangeLayoutType),
    fork(watchChangeLayoutWidth),
    fork(watchChangeLeftSidebarTheme),
    fork(watchChangeLeftSidebarType),
    fork(watchToggleRightSidebar),
    fork(watchShowRightSidebar),
    fork(watchHideRightSidebar),
    fork(watchShowFeedback),
    // fork(hideFeedback)
  ])
}

export default LayoutSaga
