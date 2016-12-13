<?php
class XApp_Exception extends Exception
{
	/**
	 * Returns all previous exceptions in an array.
	 *
	 * @return array
	 */
	public function getAllPrevious()
	{
		$stack = array();
		$previous = $this->getPrevious();
		while (null !== $previous) {
			$stack[] = $previous;
			$previous = $previous->getPrevious();
		}
		return $stack;
	}
}
