export default function tw(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
