import { Icon } from '@iconify/react'
import archiveBox from '@iconify-icons/ph/archive-box-duotone'
import arrowDownRight from '@iconify-icons/ph/arrow-down-right'
import arrowLeft from '@iconify-icons/ph/arrow-left'
import arrowRight from '@iconify-icons/ph/arrow-right'
import arrowUpRight from '@iconify-icons/ph/arrow-up-right'
import brain from '@iconify-icons/ph/brain-duotone'
import buildings from '@iconify-icons/ph/buildings-duotone'
import checkCircle from '@iconify-icons/ph/check-circle-duotone'
import circuitry from '@iconify-icons/ph/circuitry-duotone'
import code from '@iconify-icons/ph/code-duotone'
import cube from '@iconify-icons/ph/cube-duotone'
import database from '@iconify-icons/ph/database-duotone'
import eye from '@iconify-icons/ph/eye-duotone'
import flask from '@iconify-icons/ph/flask-duotone'
import graduationCap from '@iconify-icons/ph/graduation-cap-duotone'
import hammer from '@iconify-icons/ph/hammer-duotone'
import heart from '@iconify-icons/ph/heart-duotone'
import lightbulb from '@iconify-icons/ph/lightbulb-duotone'
import list from '@iconify-icons/ph/list'
import lockKey from '@iconify-icons/ph/lock-key-duotone'
import mapTrifold from '@iconify-icons/ph/map-trifold-duotone'
import printer from '@iconify-icons/ph/printer'
import puzzlePiece from '@iconify-icons/ph/puzzle-piece-duotone'
import rocketLaunch from '@iconify-icons/ph/rocket-launch-duotone'
import shieldCheck from '@iconify-icons/ph/shield-check-duotone'
import sparkle from '@iconify-icons/ph/sparkle-duotone'
import trash from '@iconify-icons/ph/trash'
import trophy from '@iconify-icons/ph/trophy-duotone'
import users from '@iconify-icons/ph/users-duotone'
import usersThree from '@iconify-icons/ph/users-three-duotone'
import x from '@iconify-icons/ph/x'

const icons = {
  archive: archiveBox, arrowDownRight, arrowLeft, arrowRight, arrowUpRight,
  brain, buildings, checkCircle, circuitry, code, cube, database, eye, flask,
  graduationCap, hammer, heart, lightbulb, list, lockKey, map: mapTrifold,
  printer, puzzle: puzzlePiece, rocket: rocketLaunch, shieldCheck, sparkle,
  trash, trophy, users, usersThree, x,
} as const

export type AppIconName = keyof typeof icons

type Props = { name: AppIconName; className?: string; size?: number }

export function AppIcon({ name, className, size = 24 }: Props) {
  return <Icon icon={icons[name]} className={className} width={size} height={size} aria-hidden="true" />
}
