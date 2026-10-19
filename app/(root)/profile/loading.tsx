const Loading = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3" role="status">
        <div
          className="size-8 animate-spin rounded-full border-4 border-light-700 border-t-primary-500"
          aria-hidden="true"
        />
        <p className="body-regular text-dark400_light700">Loading profile page...</p>
      </div>
    </div>
  )
}

export default Loading
